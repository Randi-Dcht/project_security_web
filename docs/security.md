# Project Health's : security

Any submission must include a report under PDF format detailing your choices regarding
security : `with typst`

Check-list
1. Do I properly ensure confidentiality?
   • Are sensitive data transmitted and stored securely?
   • Are sensitive requests sent to the server transmitted securely?
   • Do I achieve end-to-end encryption (if relevant)?
   • Does a system administrator have access to the sensible data of some arbitrary user?
2. Do I properly ensure integrity of stored data?
3. Do I properly ensure non-repudiation?
   • Do I use signature, certificates, a proper authority?
4. Do I use a proper and strong authentication scheme?
    • Do I follow OWASP guidelines?
    • Is my authentication broken (cf. OWASP 10)?
5. Do my security features rely on secrecy, beyond credentials?
6. Am I vulnerable to injection?
   • URL, SQL, Javascript and dedicated parser injections
7. Am I vulnerable to data remanence attacks?
8. Am I vulnerable to replay attacks?
9. Am I vulnerable to fraudulent request forgery?
10. Am I monitoring enough user activity so that I can immediately detect maliciousor analyse an attack a posteriori?
    • Do I simply reject invalid entries, or do I analyse them?
    • Can logs be falsified?
11. Am I using components with know vulnerabilities?
12. Is my system updated?
13. Is my access control broken (cf. OWASP 10)?
    • Do I use indirect references to resource or functions?
14. Are my general security features misconfigured (cf. OWASP 10)?
    Also, note that you will unlinkely graduate should you fail to
    • use a (at least self-signed) certificate for your server,
    • use a framework (at least for the server’s side),
    • achieve end-to-end encryption (if relevant).

---

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

