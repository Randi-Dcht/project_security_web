<?php

namespace App\Logging;

use Monolog\Processor\ProcessorInterface;

class CustomProcess implements ProcessorInterface
{
    public function __invoke(array|\Monolog\LogRecord $record): array|\Monolog\LogRecord
    {
        // Ajouter le temps actuel au message
        // Calculer le hachage du message précédent
        $previousHash = isset($record['context']['previous_message']) ? md5($record['context']['previous_message']) : '';
        // Ajouter le hachage du message précédent au message

        //$record['message'] = $record['message'] . ' ' . $previousHash ;

        return $record;
    }
}
