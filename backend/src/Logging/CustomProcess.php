<?php

namespace App\Logging;

use Monolog\Processor\ProcessorInterface;
use Psr\Log\LoggerInterface;

class CustomProcess implements ProcessorInterface
{

    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function __invoke(array|\Monolog\LogRecord $record): array|\Monolog\LogRecord
    {
        // Ajouter le temps actuel au message
        // Calculer le hachage du message précédent
        $myId = uniqid();
        $previousHash = isset($record['context']['previous_message']) ? md5($record['context']['previous_message']) : '';
        $log = $record['message'] . ' ' . $myId . ' ' . $previousHash;
        $this->logger->notice($log);
        // Ajouter le hachage du message précédent au message

        //$record['message'] = $record['message'] . ' ' . $previousHash ;

        return $record;
    }
}
