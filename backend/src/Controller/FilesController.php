<?php

namespace App\Controller;

use App\Entity\Files;
use App\Repository\FilesRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class FilesController extends AbstractController
{
    #[Route('/files/upload', name: 'add_file', methods: ['POST'])]
    public function postFile(FilesRepository $filesRepository, Request $request, SerializerInterface $serializer): JsonResponse
    {
        //TODO add file in db with permission user
        $req = $serializer->deserialize($request->getContent(), Files::class, 'json');
        $filesRepository->save($req, true);

        //save file in folder
        $file = fopen("files/".$req->getUuid(), "w");
        fwrite($file, $req);
        fclose($file);

        return new JsonResponse("200", Response::HTTP_OK, [], true);
    }
}
