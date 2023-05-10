# Project Health's : security

## Symphony

### users

We use the symphony's embedded configuration `composer require symfony/security-bundle` that handle :

1. Authentication `firewall` : HTTP auth, certification, login, API, OAuth, ...
2. Authorization `access control` : Who (`role`) access which page

### firewall

The `provider` is a kind of user knowledge base that give a door through the firewall. Can be managed in *memory* or by *entities*.

### encoder

To manage hash code : MD5, sha1, bcrypt or plaintext

### sources

- https://cours.davidannebicque.fr/symfony/v/version-4.1/securite
- https://openclassrooms.com/fr/courses/5489656-construisez-un-site-web-a-l-aide-du-framework-symfony-5/5654131-securisez-lacces-de-votre-site-web

## Guidelines and reflexions

We want `access management` and `end-to-end encryption` we are looking what's done by matrix and others. We also need a `multi-device connections` and we are thinking that server won't keep the keys. We want `forward secrecy` and `certification` for this last point we will probably just explain how do it and use open ssl.

### Secure connection

Authentication and authorization is provided by symphony

### Forward secrecy

Grant went we don't two times the same key. So *the patient* send a `key` to *the doctor* using *the doctor's* public keys. The *doctor* use his private key to read the key to access the *patient* page.

### Sanity check
 
We want to sanity check `grammar` or `regexp` the forms entries in backend and take action when something suspicious appear even if they are also managed in front end.

Some actions that can be taken : deactivate the attacker access, analyse all the information (ip address, ...), perhaps blocking all a range of addresses.

