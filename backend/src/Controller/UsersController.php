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

    #[Route('/users/add', name: 'users_create', methods: ['POST'])]
    public function createUser(UsersRepository $usersRepository, Request $request, SerializerInterface $serializer): JsonResponse
    {
        //TODO check all value !! (injection or bad value to logger !!!)
        $req = $serializer->deserialize($request->getContent(), Users::class, 'json');
        $usersRepository->save($req, true);
        return new JsonResponse(null, Response::HTTP_CREATED);
    }


}
