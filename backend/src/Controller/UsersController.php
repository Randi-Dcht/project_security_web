<?php

namespace App\Controller;

use App\Entity\Users;
use App\Repository\UsersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class UsersController extends AbstractController
{
    #[Route('/users/list', name: 'users_list', methods: ['GET'])]
    public function getListUser(UsersRepository $users_list, SerializerInterface $serializer): JsonResponse
    {
        $users = $users_list->findAll();
        $userList = $serializer->serialize($users, 'json');
        return new JsonResponse($userList, Response::HTTP_OK, [], true);
    }

    #[Route('/users/delete/{id}', name: 'users_delete', methods: ['DELETE'])]
    public function deleteUser(Users $user, UsersRepository $usersRepository): JsonResponse
    {
        $usersRepository->remove($user, true);
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/patient/add', name: 'patient_create', methods: ['POST'])]
    public function addPatient(UsersRepository $usersRepository, Request $request, SerializerInterface $serializer): JsonResponse
    {
        $this->addUser($usersRepository, $request, $serializer, "PATIENT");
        return new JsonResponse(null, Response::HTTP_CREATED);
    }

    #[Route('/doctor/add', name: 'doctor_create', methods: ['POST'])]
    public function addDoctor(UsersRepository $usersRepository, Request $request, SerializerInterface $serializer): JsonResponse
    {
        $this->addUser($usersRepository, $request, $serializer, "DOCTOR");
        return new JsonResponse(null, Response::HTTP_CREATED);
    }

    public function addUser(UsersRepository $usersRepository, Request $request, SerializerInterface $serializer, string $role): void
    {
        //TODO check all value !! (injection or bad value to logger !!!)
        $req = $serializer->deserialize($request->getContent(), Users::class, 'json');
        $req->setRole($role);
        $usersRepository->save($req, true);
    }


}
