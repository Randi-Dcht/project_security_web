<?php

namespace App\Tests\Auth;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class certTest extends WebTestCase
{


    public function testGetSecuredWithoutCertificate(): void
    {
        $client = static::createClient([], [
            'HTTPS' => true,
        ]);
        $client->request('GET', '/users/list');
        self::assertResponseStatusCodeSame(401);
    }

    public function testGetSecuredWithSSLClientRightEmailAddress(): void
    {
        $client = static::createClient([], [
            'SSL_CLIENT_S_DN' => 'bob',
            'SSL_CLIENT_S_DN_email' => 'bob@bob.com',
            'SSL_CLIENT_VERIFY' => 'SUCCESS',
            'HTTPS' => true,
        ]);
        $client->request('GET', '/users/list');
        self::assertResponseIsSuccessful();
    }
}