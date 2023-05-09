<?php

namespace App\Entity;

use App\Repository\FilesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FilesRepository::class)]
class Files
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $pathName = null;

    #[ORM\Column(length: 255)]
    private ?string $lastUpdate = null;

    #[ORM\ManyToMany(targetEntity: Users::class, inversedBy: 'files')]
    private Collection $access;

    public function __construct()
    {
        $this->access = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPathName(): ?string
    {
        return $this->pathName;
    }

    public function setPathName(string $pathName): self
    {
        $this->pathName = $pathName;

        return $this;
    }

    public function getLastUpdate(): ?string
    {
        return $this->lastUpdate;
    }

    public function setLastUpdate(string $lastUpdate): self
    {
        $this->lastUpdate = $lastUpdate;

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
}
