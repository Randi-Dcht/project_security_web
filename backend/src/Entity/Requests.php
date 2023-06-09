<?php

namespace App\Entity;

use App\Repository\RequestsRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;

#[ORM\Entity(repositoryClass: RequestsRepository::class)]
class Requests
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $type = null;

    #[ORM\ManyToOne(inversedBy: 'requests')]
    #[ORM\JoinColumn(nullable: false)]
    #[Ignore]
    private ?Users $origin = null;

    #[ORM\ManyToOne(inversedBy: 'requested')]
    #[ORM\JoinColumn(nullable: false)]
    #[Ignore]
    private ?Users $destination = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Ignore]
    private ?Files $file = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getOrigin(): ?Users
    {
        return $this->origin;
    }

    public function setOrigin(?Users $origin): self
    {
        $this->origin = $origin;

        return $this;
    }

    public function getDestination(): ?Users
    {
        return $this->destination;
    }

    public function setDestination(?Users $destination): self
    {
        $this->destination = $destination;

        return $this;
    }

    public function getFile(): ?Files
    {
        return $this->file;
    }

    public function setFile(?Files $file): self
    {
        $this->file = $file;

        return $this;
    }
}