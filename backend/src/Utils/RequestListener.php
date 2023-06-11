<?php

namespace App\Utils;
// src/EventSubscriber/RequestListener.php

use App\Utils\DataValidator;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;

class RequestListener implements EventSubscriberInterface
{
    private \App\Utils\DataValidator $dataValidator;

    public function __construct(DataValidator $dataValidator)
    {
        $this->dataValidator = $dataValidator;
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        // Récupérer la requête actuelle
        $request = $event->getRequest();
        // Valider les données de la requête en utilisant le service DataValidator
        $this->dataValidator->validate($request);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'kernel.request' => 'onKernelRequest',
        ];
    }
}
