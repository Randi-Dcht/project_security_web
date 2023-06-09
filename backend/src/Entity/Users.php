<?php

namespace App\Entity;

use App\Repository\UsersRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Ignore;

#[ORM\Entity(repositoryClass: UsersRepository::class)]
class Users implements UserInterface, \Serializable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $uuid = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column(length: 255)]
    private ?string $dateSignUp = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $email = null;

    #[ORM\ManyToMany(targetEntity: Files::class, mappedBy: 'access')]
    #[Ignore]
    private Collection $files;

    #[ORM\ManyToMany(targetEntity: Users::class, mappedBy: 'patient')]
    #[ORM\JoinColumn(name: 'doctor_id', referencedColumnName: 'id')]
    #[ORM\InverseJoinColumn(name: 'patient_id', referencedColumnName: 'id')]
    #[Ignore]
    private Collection $doctor;

    #[ORM\ManyToMany(targetEntity: Users::class, inversedBy: 'doctor')]
    #[Ignore]
    private Collection $patient;

    #[ORM\OneToMany(mappedBy: 'origin', targetEntity: Requests::class, orphanRemoval: true)]
    private Collection $requests;

    #[ORM\OneToMany(mappedBy: 'destination', targetEntity: Requests::class, orphanRemoval: true)]
    private Collection $requested;

    #[ORM\Column(length: 2048)]
    private ?string $publicKey = null;

    public function __construct()
    {
        $this->files = new ArrayCollection();
        $this->patient = new ArrayCollection();
        $this->doctor = new ArrayCollection();
        $this->requests = new ArrayCollection();
        $this->requested = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): self
    {
        $this->uuid = $uuid;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->uuid;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function addRole(string $role): void
    {
        $this->roles[] = $role;

    }

    public function removeRole(string $role): void
    {
        $this->roles = \array_diff($this->roles, [$role]);;

    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return Collection<int, Files>
     */
    public function getFiles(): Collection
    {
        return $this->files;
    }

    public function getFilesInfo(): array
    {
        $names = [];
        foreach ($this->files as &$file) {
           $names[] =$file;
       }

            return $names;
    }
    public function serialize(): ?string
    {
        return serialize(array(
            $this->id,
            $this->email,
            $this->name,
            $this->roles,
            $this->dateSignUp,
        ));
    }

    public function unserialize(string $data): void
    {
        list(
            $this->id,
            $this->email,
            $this->name,
            $this->roles,
            $this->dateSignUp,
            ) = unserialize($data);
    }

    public function addDoctor(Users $doctor): self
    {
       $doctor->addPatient($this);
       return $this;
    }

    public function removeDoctor(Users $doctor): self
    {
        $doctor->removePatient($this);
        return $this;
    }

    public function addPatient(Users $patient): self
    {
        if (!$this->patient->contains($patient) ) {
            $this->patient->add($patient);
        }

        return $this;
    }

    public function removePatient(Users $patient): self
    {
        $this->patient->removeElement($patient);

        return $this;
    }

    public function getDoctor(): Collection
    {
        return $this->doctor;
    }

    public function getPatient(): Collection
    {
        return $this->patient;
    }

    /**
     * @return Collection<int, Requests>
     */
    public function getRequests(): Collection
    {
        return $this->requests;
    }

    public function addRequest(Requests $request): self
    {
        if (!$this->requests->contains($request)) {
            $this->requests->add($request);
            $request->setOrigin($this);
        }

        return $this;
    }

    public function removeRequest(Requests $request): self
    {
        if ($this->requests->removeElement($request)) {
            // set the owning side to null (unless already changed)
            if ($request->getOrigin() === $this) {
                $request->setOrigin(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Requests>
     */
    public function getRequested(): Collection
    {
        return $this->requested;
    }

    public function addRequested(Requests $requested): self
    {
        if (!$this->requested->contains($requested)) {
            $this->requested->add($requested);
            $requested->setDestination($this);
        }

        return $this;
    }

    public function removeRequested(Requests $requested): self
    {
        if ($this->requested->removeElement($requested)) {
            // set the owning side to null (unless already changed)
            if ($requested->getDestination() === $this) {
                $requested->setDestination(null);
            }
        }

        return $this;
    }

    public function getPublicKey(): ?string
    {
        return $this->publicKey;
    }

    public function setPublicKey(string $publicKey): self
    {
        $this->publicKey = $publicKey;

        return $this;
    }




}
