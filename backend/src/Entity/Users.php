<?php

namespace App\Entity;

use App\Repository\UsersRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsersRepository::class)]
class Users
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $surname = null;

    #[ORM\Column]
    private ?int $numberId = null;

    #[ORM\Column(length: 255)]
    private ?string $dateSignUp = null;

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

    public function getSurname(): ?string
    {
        return $this->surname;
    }

    public function setSurname(string $surname): self
    {
        $this->surname = $surname;

        return $this;
    }

    public function getNumberId(): ?int
    {
        return $this->numberId;
    }

    public function setNumberId(int $numberId): self
    {
        $this->numberId = $numberId;

        return $this;
    }

    public function getDateSignUp(): ?string
    {
        return $this->dateSignUp;
    }

    public function setDateSignUp(string $dateSignUp): self
    {
        $this->dateSignUp = $dateSignUp;

        return $this;
    }
}
