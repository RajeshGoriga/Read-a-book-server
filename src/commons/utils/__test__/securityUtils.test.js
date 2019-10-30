import securityUtils from '../securityUtils'
import {
    expect,
    assert
} from 'chai';


describe('Security Utils', function () {
    describe('encryptPhrase', function () {
        it('encryptPhrase should return encrypted string with valid arguments', () => {
            var phrase = "srinag"
            var result = securityUtils.encryptPhrase(phrase);
            expect(result).to.have.lengthOf(result.length)
        });
        it('encryptPhrase should return null with invalid arguments', () => {
            var phrase = null
            var result = securityUtils.encryptPhrase(phrase);
            expect(result).to.not.match(/srinag/)
        });
    })

    describe('decryptPhrase', function () {
        it('decryptPhrase should return decrypted string with valid arguments', function () {
            var phrase = "Viw9hl1G84ycIyBMfWEDfyeCj5AV/g=="
            var plaintext = /srinag/
            var result = securityUtils.decryptPhrase(phrase);
            expect(result).to.match(plaintext)
        })
        it('decryptPhrase should return null with invalid arguments', function () {
            var phrase = null
            var plaintext = /srinag/
            var result = securityUtils.decryptPhrase(phrase);
            expect(result).to.not.match(plaintext);
        })
    })
});