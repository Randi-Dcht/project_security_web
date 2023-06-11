<?php

namespace App\Controller;

use App\Entity\Requests;
use App\Entity\Users;
use App\Repository\RequestsRepository;
use App\Repository\UsersRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RequestsController extends AbstractController
{
    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    #[Route('/requests/patient/{email}', name: 'request_patient', methods: ["POST"])]
    public function request_patient(Users $patient,RequestsRepository $requests, UsersRepository $users): JsonResponse
    {
        return $this->make_patient_request("PATIENT_ADD",$patient,$users,$requests);
    }

    #[Route('/requests/patient/{uuid}', name: 'unrequest_patient', methods: ["DELETE"])]
    public function unrequest_patient(Users $patient,RequestsRepository $requests, UsersRepository $users): JsonResponse
    {
        return $this->make_patient_request("PATIENT_DELETE",$patient,$users,$requests);
    }

    private function make_patient_request(string $type,Users $patient, UsersRepository $users, RequestsRepository $requests){
        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);
        if (in_array("ROLE_DOCTOR", $user->getRoles()) && in_array("ROLE_PATIENT", $patient->getRoles())){

            $request = new Requests();
            $request->setType($type);
            $request->setDestination($patient);
            $request->setOrigin($user);
            $request->setSymKey($user->getPublicKey());

            $requests->save($request,true);

            $this->logger->info("Request sent to patient: " . $patient->getUuid() . " from doctor: " . $user->getUuid(). " of type: ". $type);

            return new JsonResponse(null, Response::HTTP_OK);
        }

        $this->logger->error("Request failed to send to patient: " . $patient->getUuid() . " from doctor: " . $user->getUuid()." of type: ". $type);
        return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
    }


    #[Route('/requests/accept/{id}', name: 'accept_request', methods: ["POST"])]
    public function accept_request(Requests $request, UsersRepository $users, RequestsRepository $requests): JsonResponse
    {
        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);

        if ($user->getIncomingRequests()->contains($request)){
            if ($request->getType() == "PATIENT_ADD"){

                $doctor = $request->getOrigin();
                $user->addDoctor($doctor);
                $users->save($doctor,true);


            }else if ($request->getType() == "PATIENT_DELETE"){

                $doctor = $request->getOrigin();
                $user->removeDoctor($doctor);
                $users->save($doctor,true);

            }  else if ($request->getType() == "FILE"){


            } else if ($request->getType() == "KEY"){


            }

            $requests->remove($request,true);
            $this->logger->info("Request accepted by: " . $user->getUuid());
            return new JsonResponse(null, Response::HTTP_OK);
        }
        $this->logger->error("Request failed to accept by: " . $user->getUuid());
        return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
    }

    #[Route('/requests/sendKey/{uuid}', name: 'send_key', methods: ["POST"])]
    public function send_key(Users $doctor, UsersRepository $users, RequestsRepository $requests, Request $key): JsonResponse
    {
        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);
        if (in_array("ROLE_DOCTOR", $doctor->getRoles()) && in_array("ROLE_PATIENT", $user->getRoles())){

            $request = new Requests();
            $request->setType("KEY");
            $request->setDestination($doctor);
            $request->setOrigin($user);
            $request->setSymKey($key->getContent());

            $requests->save($request,true);
            $this->logger->info("Key sent to doctor: " . $doctor->getUuid() . " from patient: " . $user->getUuid());

            return new JsonResponse(null, Response::HTTP_OK);
        }

        $this->logger->error("Key failed to send to doctor: " . $doctor->getUuid() . " from patient: " . $user->getUuid());
        return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
    }
}
