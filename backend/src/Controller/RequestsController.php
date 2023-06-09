<?php

namespace App\Controller;

use App\Entity\Requests;
use App\Entity\Users;
use App\Repository\RequestsRepository;
use App\Repository\UsersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RequestsController extends AbstractController
{
    #[Route('/requests/patient/{uuid}', name: 'request_patient', methods: ["POST"])]
    public function request_patient(Users $patient,RequestsRepository $requests, UsersRepository $users): JsonResponse
    {


        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);
        if (in_array("ROLE_DOCTOR", $user->getRoles()) && in_array("ROLE_PATIENT", $patient->getRoles())){

            $request = new Requests();
            $request->setType("PATIENT");
            $request->setDestination($patient);
            $request->setOrigin($user);

            $requests->save($request,true);

            return new JsonResponse(null, Response::HTTP_OK);
        }

        return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
    }


    #[Route('/requests/accept/{id}', name: 'accept_request', methods: ["POST"])]
    public function accept_request(Requests $request, UsersRepository $users): JsonResponse
    {
        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);

        if ($user->getRequested()->contains($request)){
            if ($request->getType() == "PATIENT"){

                $doctor = $request->getOrigin();
                $user->addDoctor($doctor);
                $users->save($doctor,true);

                return new JsonResponse(null, Response::HTTP_OK);

            } else if ($request->getType() == "FILE"){



                return new JsonResponse(null, Response::HTTP_OK);
            }

        }

        return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
    }
}
