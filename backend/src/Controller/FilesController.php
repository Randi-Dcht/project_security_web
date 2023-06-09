<?php

namespace App\Controller;

use App\Entity\Files;
use App\Repository\FilesRepository;
use App\Repository\UsersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Vich\UploaderBundle\Handler\DownloadHandler;

class FilesController extends AbstractController
{
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

        $filesRepository->save($file, true);


        return new JsonResponse(null, Response::HTTP_OK);
    }
    #[Route('/files/delete/{name}', name: 'delete_file', methods: ['DELETE'])]
    public function deleteFile(Files $file,UsersRepository $users, FilesRepository $files): JsonResponse
    {
        $id = $this->getUser()->getUserIdentifier();

        if (!$this->hasAccess($id,$users,$file)){
            return new JsonResponse( null,Response::HTTP_FORBIDDEN);
        }

        $files->remove($file,true);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
    #[Route('/files/', name: 'get_files_list', methods: ['GET'])]
    public function getFilesList(UsersRepository $users, SerializerInterface $serializer): JsonResponse
    {
        $user = $this->getUser();
        $id = $user->getUserIdentifier();
        $user = $users->findOneBy(["uuid" => $id]);
        $files = $user->getFiles();

        $files = $serializer->serialize($files, 'json');

        return new JsonResponse($files, Response::HTTP_OK, [], true);
    }
    #[Route('/files/{name}', name: 'get_file', methods: ['GET'])]
    public function getFile(Files $file,UsersRepository $users, DownloadHandler $downloadHandler): Response
    {
        $id = $this->getUser()->getUserIdentifier();

        if (!$this->hasAccess($id,$users,$file)){
            return new Response( null,Response::HTTP_FORBIDDEN);
        }

        return $downloadHandler->downloadObject($file, $file = 'file');
    }

    private function hasAccess(int $id,UsersRepository $users,Files $file) :bool
    {
        $user = $users->findOneBy(["uuid" => $id]);
        return $file->hasAccess($user);
    }
}
