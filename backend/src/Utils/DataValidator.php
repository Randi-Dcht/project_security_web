<?php

namespace App\Utils;

use Psr\Log\LoggerInterface;

class DataValidator
{

    private LoggerInterface $logger;

    private $patternCode = '/\b(function|class|if|else|for|while|foreach)\b/i';
    private $patternSql = '/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i';
    private $patternJs = '/\b(alert|prompt|confirm|console|document|window|eval)\b/i';
    private $patternPhp = '/\b(eval|exec|shell_exec|passthru|system|popen|proc_open|pcntl_exec|assert|preg_replace|create_function|include|require|include_once|require_once)\b/i';
    private $patternXss = '/\b(<|>|\'|"|;|&|`|\/|\?|%|#|\*|!|\^|\(|\)|{|}|\[|\]|~|\\\\)\b/i';

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function validate(\Symfony\Component\HttpFoundation\Request $request): void
    {
        // Récupérer les données de la requête
        $data = $request->request->all();
        // Valider les données
        $this->logger->info('DataValidator: ' . json_encode($data));

        if (preg_match($this->patternCode, json_encode($data)) || preg_match($this->patternSql, json_encode($data)) ||
            preg_match($this->patternJs, json_encode($data)) || preg_match($this->patternPhp, json_encode($data)) ||
            preg_match($this->patternXss, json_encode($data)))
        {
            $this->logger->error('DataValidator: ' . json_encode($data));
            // TODO error with user null pointer
            //$this->getUser()->addBan();
        }
    }
}