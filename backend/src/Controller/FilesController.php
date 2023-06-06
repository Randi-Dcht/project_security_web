<?php

namespace App\Controller;

use App\Entity\Users;
use App\Repository\FilesRepository;
use App\Repository\UsersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Psr\Log\LoggerAwareInterface;

class FilesController extends AbstractController
{
    #[Route('/users/addFiles', name: 'add_file', methods: ['POST'])]
    public function postFile(FilesRepository $filesRepository, Request $request, SerializerInterface $serializer): JsonResponse
    {
        //TODO add file in db with permission user
        $req = $serializer->deserialize($request->getContent(), Files::class, 'json');
        $filesRepository->save($req, true);
        $encryption_key = base64_decode($req->getEncryptionKey());
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
        $encrypted = openssl_encrypt($req->getFile(), 'aes-256-cbc', $encryption_key, 0, $iv);

        //save file in folder
        $file = fopen("files/".$req->getUuid(), "w");
        fwrite($file, $encrypted);
        fclose($file);

        return new JsonResponse("200", Response::HTTP_OK, [], true);
    }
}
