import aes256 from 'aes256';
import config from '../../config/index';

class SecurityUtils {
    constructor() {
        this.key = config.aes.key;
    }

    encryptPhrase(passPhrase) {
        var encrypted = null;
        try {
            var encrypted = aes256.encrypt(this.key, passPhrase);
            console.log(encrypted);
        } catch (e) {
            console.log(e.message);
        }
        return encrypted;
    }

    decryptPhrase(encryptedPhrase) {
        var decrypted = null;
        try {
            var decrypted = aes256.decrypt(this.key, encryptedPhrase);
            console.log(decrypted);
        } catch (e) {
            console.log(e.message)
        }
        return decrypted;
    }
}

var securityUtils = new SecurityUtils();
export default securityUtils;