<?php


namespace App\Utils;

class CheckInjection
{
    // create function check is injection code
    public function checkInjection($data)
    {
        $injection = array(
            'sql' => '/(union|select|from|where|insert|delete|update|drop|create|show|order|by|
                      group|having|into|load_file|outfile|dumpfile|sub|hex|file_put_contents|fwrite
                      |curl|system|eval|assert|file_get_contents|file|fopen|fsockopen|exec|shell_exec
                      |passthru|proc_open|popen|pcntl_exec|posix_kill|posix_mkfifo|posix_setpgid|
                      posix_setsid|posix_setuid|posix_setgid|exec|system|passthru|shell_exec|popen
                      |proc_open|pcntl_exec|eval|assert|include|require|include_once|require_once|
                      call_user_func|call_user_func_array|create_function|$_GET|$_POST|
                      $_REQUEST|$_COOKIE|$_FILES|$_SESSION|$_ENV|$_SERVER|preg_replace|preg_filter',
            'xss' => '/(<|>|\'|"|;|&|`|\/|\?|%|#|\*|!|\^|\(|\)|{|}|\[|\]|~|\\\\)/',
            'javascript' => '/(abstract|arguments|await*|boolean|break|byte|case|catch|char|class*|const|continue|debugger|default|delete|do|double|else|enum*|eval|export*|extends*|false|final|finally|float|for|function|goto|if|implements|import*|in|instanceof|int|interface|let*|long|native|new|null|package|private|protected|public|return|short|static|super*|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|volatile|while|with|yield)',
            'url' => '/(www|http)',
        );

        foreach ($injection as $key => $value) {
            if (preg_match($value, $data)) {
                return true;
            }
        }

        return false;
    }
}

