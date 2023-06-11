<?php

namespace App\Controller;

use App\Entity\Users;
use App\Repository\UsersRepository;

use phpseclib3\Crypt\PublicKeyLoader;
use phpseclib3\File\X509;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Psr\Log\LoggerInterface;

class UsersController extends AbstractController
{
    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }


    #[Route('/registerP', name: 'register_patient', methods: ['POST'])]
    public function registerPatient(UsersRepository $users, Request $request): Response
    {
        $this->logger->info("Registering patient");

        return $this->registerUser($users, $request, "ROLE_PATIENT");
    }


    #[Route('/registerAD', name: 'register_admin', methods: ['POST'])]
    public function registerOther(UsersRepository $users, Request $request): Response
    {
        $this->logger->info("Registering admin");

        return $this->registerUser($users, $request, "");
    }


    public function registerUser(UsersRepository $users, Request $request, string $role): Response
    {
        //TODO check all value !! (injection or bad value to logger !!!) #security

        $subject = openssl_csr_get_subject($request);
        if (!array_key_exists("emailAddress", $subject) or !array_key_exists("CN", $subject)) {
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

            $roles = ["ROLE_USER"];

            if ($role != "") {
                $roles[] = $role;
            }

            //TODO remove that ?
            if (count($users->findAll()) == 0) {
                $roles = ["ROLE_USER", "ROLE_ADMIN"];
            }

            $this->logger->info("Registering user : ".$name." with email : ".$email);

            $public_key = openssl_csr_get_public_key($request);
            $key_info = openssl_pkey_get_details($public_key);
            $info["public_key"] = $key_info['key'];

            $user = $this->addUser($info, $roles, $users);

            // sign the certificate request
            $output = $this->sign_csr($request, $user);

            $users->save($user, true);

            return new Response($output, Response::HTTP_CREATED);
        }
    }
    public function addUser(array $info, array $role, UsersRepository $usersRepository): Users
    {
        $myId = date('y').random_int(11, 999).$usersRepository->count([]);
        $user = new Users();
        $user->setEmail($info["email"]);
        $user->setName($info["name"]);
        $user->setPublicKey($info["public_key"]);
        $user->setUuid($myId);
        $user->setRoles($role);
        $user->setDateSignUp(time());
        $usersRepository->save($user, true);
        $this->logger->info("User : ".$info["name"]." with email : ".$info["email"]." registered");

        return $user;
    }
    #[Route('/changeInfo', name: 'change_info', methods: ['POST'])]
    public function change_info(UsersRepository $users, Request $request): Response
    {
        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);

        $subject = openssl_csr_get_subject($request);
        if (!array_key_exists("emailAddress", $subject) or !array_key_exists("CN", $subject)) {
            return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
        }

        $email = $subject["emailAddress"];

        $criteria = array('email' => $email);
        $exist = $users->findBy($criteria);

        if (count($exist) >= 1 && $exist[0]->getUuid() != $user->getUuid()) {
            return new JsonResponse(null, Response::HTTP_CONFLICT);
        }

        // create the user
        $user->setEmail($email);
        $user->setName( $subject["CN"]);

        $public_key = openssl_csr_get_public_key($request);
        $key_info = openssl_pkey_get_details($public_key);
        $user->setPublicKey($key_info['key']);

        $this->revoke_cert($user->getUserIdentifier()*1000+$user->getCertNbr()-1);

        // sign the certificate request
        $output = $this->sign_csr($request, $user);

        $users->save($user, true);

        return new Response($output, Response::HTTP_CREATED);


    }
    private function sign_csr(string $request, Users $user): string
    {
        $path = $this->getParameter('kernel.project_dir');
        $cacert = "file://".$path."/cert/ca.crt";
        $privkey = "file://".$path."/cert/ca.key";
        $signed = openssl_csr_sign(
            $request,
            $cacert,
            $privkey,
            365,
            array('digest_alg' => 'sha256'),
            intval($user->getUserIdentifier()) * 1000 + $user->getCertNbr()
        );
        $user->upCertNbr();
        openssl_x509_export($signed, $output);
        $this->logger->info("Signed certificat for : ".$user->getUserIdentifier());

        return $output;
    }


    #[Route('/users/revoke/{uuid}', name: 'revoke_cert', methods: ['POST'])]
    public function revokeCert(Users $user): JsonResponse
    {
        $this->revoke_cert($user->getUserIdentifier()*1000+$user->getCertNbr()-1);

        return new JsonResponse(null, Response::HTTP_OK);

    }

    private function revoke_cert(int $id){
        $path = $this->getParameter('kernel.project_dir');

        $cacert = "file://".$path."/cert/ca.crt";
        $cacert = file_get_contents($cacert);

        $privkey = "file://".$path."/cert/ca.key";
        $cakey = file_get_contents($privkey);

        $crl_path = "file://".$path."/cert/crl/crl.pem";
        $pemcrl = file_get_contents($crl_path);


        // Load the CA and its private key.
        $cakey = PublicKeyLoader::loadPrivateKey($cakey);
        $ca = new X509();
        $ca->loadX509($cacert);
        $ca->setPrivateKey($cakey);

        // Load the CRL.
        $crl = new X509();
        $crl->loadCA($cacert); // For later signature check.
        $crl->loadCRL($pemcrl);


        // Validate the CRL.
        if ($crl->validateSignature() !== 1) {
            //exit("CRL signature is invalid\n");
        }

        // Update the revocation list.
        $crl->setRevokedCertificateExtension($id, 'id-ce-cRLReasons', 'privilegeWithdrawn');

        // Generate the new CRL.
        $crl->setEndDate('+3 months');
        $newcrl = $crl->signCRL($ca, $crl);

        // Output it.
        //print_r($crl->saveCRL($newcrl));
        file_put_contents($crl_path, $crl->saveCRL($newcrl));

        $this->logger->info("Revoked certificat by : ".$this->getUser()->getUserIdentifier()." at : ".time()."");
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
        if (in_array("ROLE_ADMIN", $user->getRoles())) {
            return new JsonResponse(null, Response::HTTP_FORBIDDEN);
        }
        $usersRepository->remove($user, true);
        $this->logger->info("User : ".$user->getName()." with email : ".$user->getEmail()." deleted");

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/users/makeAdmin/{uuid}', name: 'admin_create', methods: ['POST'])]
    public function makeAdmin(Users $user, UsersRepository $usersRepository): JsonResponse
    {
        if (!in_array("ROLE_ADMIN", $user->getRoles())) {
            $user->addRole("ROLE_ADMIN");
            $usersRepository->save($user, true);
        }

        return new JsonResponse(null, Response::HTTP_OK);
    }

    #[Route('/users/makeDoctor/{uuid}', name: 'doctor_create', methods: ['POST'])]
    public function makeDoctor(Users $user, UsersRepository $usersRepository): JsonResponse
    {
        if (!in_array("ROLE_DOCTOR", $user->getRoles())) {
            $user->removeRole("ROLE_PATIENT");
            $user->addRole("ROLE_DOCTOR");
            $usersRepository->save($user, true);
            $this->logger->info("User : ".$user->getName()." with email : ".$user->getEmail()." is now a doctor");
        }

        return new JsonResponse(null, Response::HTTP_OK);
    }

    #[Route('/users/unmakeDoctor/{uuid}', name: 'doctor_unmake', methods: ['DELETE'])]
    public function unmakeDoctor(Users $user, UsersRepository $usersRepository): JsonResponse
    {
        if (in_array("ROLE_DOCTOR", $user->getRoles())) {
            $user->removeRole("ROLE_DOCTOR");
            $usersRepository->save($user, true);
            $this->logger->info("User : ".$user->getName()." with email : ".$user->getEmail()." is no a doctor");
        }

        return new JsonResponse(null, Response::HTTP_OK);
    }

    #[Route('/patient/addDoctor/{email}', name: 'doctor_add', methods: ['POST'])]
    public function addDoctor(Users $doctor, UsersRepository $users): JsonResponse
    {
        if (in_array("ROLE_DOCTOR", $doctor->getRoles())) {
            $id = $this->getUser()->getUserIdentifier();
            $user = $users->findOneBy(["uuid" => $id]);
            $doctor->addPatient($user);
            $users->save($doctor, true);
            $this->logger->info("User : ".$user->getName()." added to doctor : ".$doctor->getName()."");

            return new JsonResponse(null, Response::HTTP_OK);
        } else {
            $this->logger->info("User tried to add to doctor : ".$doctor->getName()." but failed");

            return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
        }

    }

    #[Route('/patient/removeDoctor/{uuid}', name: 'doctor_remove', methods: ['DELETE'])]
    public function removeDoctor(Users $doctor, UsersRepository $users): JsonResponse
    {
        if (in_array("ROLE_DOCTOR", $doctor->getRoles())) {
            $id = $this->getUser()->getUserIdentifier();
            $user = $users->findOneBy(["uuid" => $id]);
            $doctor->removePatient($user);
            $users->save($doctor, true);
            $this->logger->info("User : ".$user->getName()." removed from doctor : ".$doctor->getName()."");

            return new JsonResponse(null, Response::HTTP_OK);
        } else {
            return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/patient/doctorPublic/{uuid}', name: 'doctor_public', methods: ['GET'])]
    public function doctor_public(Users $doctor, UsersRepository $users): Response
    {
        if (in_array("ROLE_DOCTOR", $doctor->getRoles())) {
            $key = $doctor->getPublicKey();
            $this->logger->info("User : ".$doctor->getName()." public key requested");

            return new Response($key, Response::HTTP_OK);
        } else {
            return new Response(null, Response::HTTP_BAD_REQUEST);
        }

    }

    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(UsersRepository $users, SerializerInterface $serializer): JsonResponse
    {
        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);
        $this->logger->info("User : ".$user->getName()." with email : ".$user->getEmail()." requested his data");
        $user = $serializer->serialize($user, 'json');

        return new JsonResponse($user, Response::HTTP_OK, [], true);

    }

    #[Route('/patient/doctorList', name: 'patient_doctor', methods: ['GET'])]
    public function patient_doctor(UsersRepository $users, SerializerInterface $serializer): JsonResponse
    {
        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);
        $patient = $user->getDoctor()->map(function (Users $user) {
            return ["uuid" => $user->getUserIdentifier(), "name" => $user->getName()];
        });
        $patient = $serializer->serialize($patient, 'json');
        $this->logger->info("User : ".$user->getName()." with email : ".$user->getEmail()." requested his doctor list");

        return new JsonResponse($patient, Response::HTTP_OK, [], true);

    }

    #[Route('/doctor/patientsList', name: 'doctor_patient', methods: ['GET'])]
    public function doctor_patient(UsersRepository $users, SerializerInterface $serializer): JsonResponse
    {
        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);
        $patient = $user->getPatient()->map(function (Users $user) {
            return ["uuid" => $user->getUserIdentifier(), "name" => $user->getName()];
        });
        $patient = $serializer->serialize($patient, 'json');
        $this->logger->info(
            "User : ".$user->getName()." with email : ".$user->getEmail()." requested his patient list"
        );

        return new JsonResponse($patient, Response::HTTP_OK, [], true);

    }

}
