import forge from "node-forge";
import CryptoJS from "crypto-js";

export const  CryptJsWordArrayToUint8Array =(wordArray) => {
    const l = wordArray.sigBytes;
    const words = wordArray.words;
    const result = new Uint8Array(l);
    var i = 0 /*dst*/, j = 0 /*src*/;
    while (true) {
        // here i is a multiple of 4
        if (i == l)
            break;
        var w = words[j++];
        result[i++] = (w & 0xff000000) >>> 24;
        if (i == l)
            break;
        result[i++] = (w & 0x00ff0000) >>> 16;
        if (i == l)
            break;
        result[i++] = (w & 0x0000ff00) >>> 8;
        if (i == l)
            break;
        result[i++] = (w & 0x000000ff);
    }
    return result;
}

const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const  randomString = () => {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export const encryptText = (text, secretKey) => {
    const encryptedText = CryptoJS.AES.encrypt(text, secretKey).toString();
    return encryptedText;
}

export const decryptText = (encryptedText, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
}
export const requestCert = async (url,email,firstName,lastName,modif) =>{
    // Vérification du format de l'adresse e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log('Veuillez entrer une adresse e-mail valide.');
        return;
    }


    // Vérification du format du nom
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(lastName) || !nameRegex.test(firstName)) {
        console.log('Veuillez entrer des valeurs valides pour le nom et le prénom (lettres et espaces uniquement).');
        return;
    }

    // Générer une paire de clés
    const keys = forge.pki.rsa.generateKeyPair(2048);

    // Créer le certificat X.509
    const csr = forge.pki.createCertificationRequest();
    csr.publicKey = keys.publicKey;
    csr.setSubject([{
        name: 'emailAddress',
        value: email
    }, {
        name: 'commonName',
        value: lastName + firstName
    }]);

    // Signer le certificat
    csr.sign(keys.privateKey);

    // verify certification request
    try {
        if (csr.verify()) {
            console.log('Certification request (CSR) verified.');
        } else {
            throw new Error('Signature not verified.');
        }
    } catch (err) {
        console.log('Certification request (CSR) verification failure: ' +
            JSON.stringify(err, null, 2));
    }

    // convert certification request to PEM-format
    const pem = forge.pki.certificationRequestToPem(csr);
    console.log(pem);

    // Préparez le corps de la requête (vu que le serveur attend un fichier)
    // const body = new FormData();
    // body.append('file', new Blob([csr]), 'client.csr');

    // Envoyer le certificat au serveur
    const opt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        body: pem
    }
    if (modif){
        opt.credentials = 'include'
    }

    const response = await fetch(url, opt);

    if (response.ok) {
        console.log('Inscription réussie !');
        let crt = await response.text();
        console.log(crt);

        // generate a p12 that can be imported by Chrome/Firefox/iOS
        // (requires the use of Triple DES instead of AES)
        const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
            keys.privateKey, crt, '',
            //{algorithm: '3des'}
        );

        // base64-encode p12
        const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
        const p12b64 = forge.util.encode64(p12Der);


        // create download link for p12
        const link = document.createElement('a');
        link.setAttribute('href', 'data:application/x-pkcs12;base64,' + p12b64);
        link.setAttribute("download", "your_identity.p12");
        // Append to html link element page
        document.body.appendChild(link);
        // Start download
        link.click();
        // Clean up and remove the link
        link.parentNode.removeChild(link);

    }  else {
    console.error('Erreur lors de l\'inscription:', response.statusText);
}
}