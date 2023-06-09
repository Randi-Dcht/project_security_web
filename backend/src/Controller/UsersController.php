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
    public function registerUser(UsersRepository $users, Request $request): Response
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

            $public_key = openssl_csr_get_public_key($request);
            $key_info = openssl_pkey_get_details($public_key);
            $info["public_key"] = $key_info['key'];

            $this->addUser($info, $roles, $users);

            // sign the certificate request
            $output = $this->sign_csr($request);

            return new Response($output, Response::HTTP_CREATED);
        }
    }

    private function sign_csr(string $request) :string{
        $path = $this->getParameter('kernel.project_dir');
        $cacert = "file://" . $path . "/cert/ca.crt";
        $privkey = "file://" . $path . "/cert/ca.key";
        $signed = openssl_csr_sign($request, $cacert, $privkey, 365, array('digest_alg'=>'sha256') );
        openssl_x509_export($signed,$output);
        return $output;
    }

    public function addUser(array $info, array $role,UsersRepository $usersRepository): void
    {
        $myId = date('y') . random_int(11, 999) . $usersRepository->count([]);
        $user = new Users();
        $user->setEmail($info["email"]);
        $user->setName($info["name"]);
        $user->setPublicKey($info["public_key"]);
        $user->setUuid($myId);
        $user->setRoles($role);
        $user->setDateSignUp(time());
        $usersRepository->save($user, true);
    }

//    #[Route('/revoke', name: 'revoke_cert', methods: ['POST'])]
//    public function revokeCert(UsersRepository $users, Request $request): JsonResponse
//    {
//        $path = $this->getParameter('kernel.project_dir');
//        $cacert = "file://" . $path . "/cert/ca.crt";
//        $privkey = "file://" . $path . "/cert/ca.key";
//        $crl = "file://" . $path . "/cert/crl/pulp_crl.pem";
//        $crl = file_get_contents($crl);
//
//        $x509 = new X509();
//        $bob = "file://" . $path . "/cert//client.crt";
//        $bob = $x509->loadX509(file_get_contents($bob));
//        $sn = $bob["tbsCertificate"]["serialNumber"];
//        $sn = $sn->toString();
//
//        $CAIssuer = new X509();
//        $CAIssuer->loadCA(file_get_contents($cacert));
//        $pk = PublicKeyLoader::loadPrivateKey(file_get_contents($privkey));
//        $CAIssuer->setPrivateKey($pk);
//
//        $x509 = new x509();
//        $crl = $x509->loadCRL($crl);
//        $x509->unrevoke($sn);
//        //$revoked = $x509->listRevoked($crl);
//        //var_dump($revoked);
//        $signed = $x509->signCRL($CAIssuer, $x509);
//        print_r($signed);
//        //$crl = $x509->saveCRL($signed);
//        //print_r($crl);
//
//        return new JsonResponse(null, Response::HTTP_OK);
//
//    }

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

    #[Route('/patient/addDoctor/{uuid}', name: 'doctor_add', methods: ['POST'])]
    public function addDoctor(Users $doctor, UsersRepository $users): JsonResponse
    {
        if (in_array("ROLE_DOCTOR", $doctor->getRoles())){
            $id = $this->getUser()->getUserIdentifier();
            $user = $users->findOneBy(["uuid" => $id]);
            $doctor->addPatient($user);
            $users->save($doctor,true);
            return new JsonResponse(null, Response::HTTP_OK);
        }else{
            return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
        }

    }

    #[Route('/patient/removeDoctor/{uuid}', name: 'doctor_remove', methods: ['DELETE'])]
    public function removeDoctor(Users $doctor, UsersRepository $users): JsonResponse
    {
        if (in_array("ROLE_DOCTOR", $doctor->getRoles())){
            $id = $this->getUser()->getUserIdentifier();
            $user = $users->findOneBy(["uuid" => $id]);
            $doctor->removePatient($user);
            $users->save($doctor,true);
            return new JsonResponse(null, Response::HTTP_OK);
        }else{
            return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(UsersRepository $users, SerializerInterface $serializer): JsonResponse
    {
        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);
        $user = $serializer->serialize($user, 'json');

        return new JsonResponse($user, Response::HTTP_OK,[], true);

    }

}
