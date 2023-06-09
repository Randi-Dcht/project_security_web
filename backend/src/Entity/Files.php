<?php

namespace App\Entity;

use App\Repository\FilesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Ignore;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Vich\UploaderBundle\Entity\File as EmbeddedFile;

#[ORM\Entity(repositoryClass: FilesRepository::class)]
#[Vich\Uploadable]
class Files implements \Serializable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Vich\UploadableField(mapping: 'files', fileNameProperty: 'name')]
    #[Ignore]
    private ?File $file = null;

//    #[ORM\Embedded(class: 'Vich\UploaderBundle\Entity\File')]
//    #[Ignore]
//    private ?EmbeddedFile $eFile = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $originalName = null;

    #[ORM\Column(length: 255)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToMany(targetEntity: Users::class, inversedBy: 'files')]
    #[Ignore]
    private Collection $access;

    public function __construct()
    {
        $this->access = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * If manually uploading a file (i.e. not using Symfony Form) ensure an instance
     * of 'UploadedFile' is injected into this setter to trigger the update. If this
     * bundle's configuration parameter 'inject_on_load' is set to 'true' this setter
     * must be able to accept an instance of 'File' as the bundle will inject one here
     * during Doctrine hydration.
     *
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile|null $file
     */
    public function setFile(?File $file = null): void
    {
        $this->file = $file;

        if (null !== $file) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getFile(): ?File
    {
        return $this->file;
    }

//    public function setEFile(EmbeddedFile $eFile): void
//    {
//        $this->eFile = $eFile;
//    }
//
//    public function getEFile(): ?EmbeddedFile
//    {
//        return $this->eFile;
//    }
    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, Users>
     */
    public function getAccess(): Collection
    {
        return $this->access;
    }

    public function addAccess(Users $access): self
    {
        if (!$this->access->contains($access)) {
            $this->access->add($access);
        }

        return $this;
    }

    public function removeAccess(Users $access): self
    {
        $this->access->removeElement($access);

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getOriginalName(): ?string
    {
        return $this->originalName;
    }

    public function setOriginalName(?string $originalName): void
    {
        $this->originalName = $originalName;
    }

    public function serialize(): ?string
    {
        return serialize(array(
            $this->id,
            $this->name,
            $this->updatedAt,
            $this->originalName,
        ));
    }

    public function unserialize(string $data)
    {
        list(
            $this->id,
            $this->name,
            $this->updatedAt,
            $this->originalName,
            ) = unserialize($data);
    }

    public function hasAccess(Users $user): bool
    {
        return $this->access->contains($user);
    }

}
