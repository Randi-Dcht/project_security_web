<?php

namespace App\Controller;

use App\Entity\Files;
use App\Entity\Users;
use App\Repository\FilesRepository;
use App\Repository\UsersRepository;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Vich\UploaderBundle\Handler\DownloadHandler;

class FilesController extends AbstractController
{

    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    #[Route('/files/upload', name: 'add_file', methods: ['POST'])]
    public function postFile(UsersRepository $users, FilesRepository $filesRepository, Request $request): JsonResponse
    {

        if (! $request->files->has("file") or ! $request->request->has("name") ){
            return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
        }

        $file_ = $request->files->get("file");
        $file = new Files();
        $file->setOriginalName($request->get("name"));
        $file->setFile($file_);

        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);

        $file->addAccess($user);
        $this->logger->info("File uploaded by user: " . $user->getUuid());

        $filesRepository->save($file, true);


        return new JsonResponse($file->getName(), Response::HTTP_OK);
    }

    #[Route('/files/', name: 'get_files_list', methods: ['GET'])]
    public function getFilesList(UsersRepository $users, SerializerInterface $serializer): JsonResponse
    {
        $user = $this->getUser();
        $id = $user->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);
        $files = $user->getFiles();

        $files = $serializer->serialize($files, 'json');
        $this->logger->info("File list requested by user: " . $id);

        return new JsonResponse($files, Response::HTTP_OK, [], true);
    }

    #[Route('/files/{name}', name: 'get_file', methods: ['GET'])]
    public function getFile(Files $file,UsersRepository $users, DownloadHandler $downloadHandler): Response
    {
        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);

        if (!$this->hasAccess($user,$file) ) {
            $this->logger->info("File requested by user: " . $id . " but access denied");
            return new Response( null,Response::HTTP_FORBIDDEN);
        }

        $this->logger->info("File requested by user: " . $id);

        return $downloadHandler->downloadObject($file, $file = 'file');
    }

    #[Route('/files/{name}', name: 'delete_file', methods: ['DELETE'])]
    public function deleteFile(Files $file,UsersRepository $users, FilesRepository $files): JsonResponse
    {
        $id = $this->getUser()->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);

        if (!$this->hasAccess($user,$file)|| !in_array("ROLE_PATIENT",$user->getRoles())){
            return new JsonResponse( null,Response::HTTP_FORBIDDEN);
        }

        $files->remove($file,true);
        $this->logger->info("File deleted by user: " . $id);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }


    private function hasAccess(Users $user ,Files $file) :bool
    {
        $this->logger->info("File requested by user: " . $user->getUuid());
        return $file->hasAccess($user);
    }
}
