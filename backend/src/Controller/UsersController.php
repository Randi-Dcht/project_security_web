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

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function registerUser(UsersRepository $users, Request $request, SerializerInterface $serializer): JsonResponse
    {
        //TODO check all value !! (injection or bad value to logger !!!) #security

        $subject = openssl_csr_get_subject($request);
        if (! array_key_exists("emailAddress",$subject) or ! array_key_exists("CN",$subject)){
            return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
        }
        $email = $subject["emailAddress"];

        $criteria = array('email' => $email);
        $exist = $users->findBy($criteria);

        if (count($exist) >= 1) {
            return new JsonResponse(null, Response::HTTP_CONFLICT);
        } else {

            // create the user
            $info["email"] = $email;
            $name = $subject["CN"];
            $info["name"] = $name;

            $roles = ["ROLE_USER","ROLE_PATIENT"];

            //TODO remove that ?
            if (count($users->findAll()) ==0 ){
                $roles = ["ROLE_USER","ROLE_ADMIN"];
            }
            $this->addUser($info, $roles, $users);

            // sign the certificate request
            $path = $this->getParameter('kernel.project_dir');
            $cacert = "file://" . $path . "/cert/ca.crt";
            $privkey = "file://" . $path . "/cert/ca.key";
            $signed = openssl_csr_sign($request, $cacert, $privkey, 365, array('digest_alg'=>'sha256') );
            openssl_x509_export($signed,$output);
            //print_r($output);

            return new JsonResponse($output, Response::HTTP_CREATED);
        }


    }
    public function addUser(array $info, array $role,UsersRepository $usersRepository): void
    {
        $myId = date('y') . random_int(11, 999) . $usersRepository->count([]);
        $user = new Users();
        $user->setEmail($info["email"]);
        $user->setName($info["name"]);
        $user->setUuid($myId);
        $user->setRoles($role);
        $user->setDateSignUp(time());
        $usersRepository->save($user, true);
    }

    #[Route('/users/list', name: 'users_list', methods: ['GET'])]
    public function getListUser(UsersRepository $users_list, SerializerInterface $serializer): JsonResponse
    {
        $users = $users_list->findAll();
        $userList = $serializer->serialize($users, 'json');
        return new JsonResponse($userList, Response::HTTP_OK, [], true);
    }

    #[Route('/users/delete/{uuid}', name: 'users_delete', methods: ['DELETE'])]
    public function deleteUser(Users $user, UsersRepository $usersRepository): JsonResponse
    {
        $usersRepository->remove($user, true);
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/users/makeDoctor/{uuid}', name: 'doctor_create', methods: ['POST'])]
    public function makeDoctor(Users $user, UsersRepository $usersRepository): JsonResponse
    {
        if (!in_array("ROLE_DOCTOR", $user->getRoles())){
            $user->removeRole("ROLE_PATIENT");
            $user->addRole("ROLE_DOCTOR");
            $usersRepository->save($user,true);
        }
        return new JsonResponse(null, Response::HTTP_OK);
    }
}
