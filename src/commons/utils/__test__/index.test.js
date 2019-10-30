import { expect, assert } from 'chai';
import utils from '../index';

describe('Utils', () => {
     describe('verifyPasswordHash', () => {
          it('verifyPasswordHash should return true response with valid pwd and hash', (done) => {
               var result = utils.verifyPasswordHash("AjarSun@123", "$2a$10$gxV68saAcZXr2P5HLwW/RuD7lninxYDfCzFAdRbQYF1kGBeXnxiea");
               assert.equal(true, result.status);
               done();
          });

          it('verifyPasswordHash should return false response with empty pwd and hash', (done) => {
               var result = utils.verifyPasswordHash("", "");
               assert.equal(false, result.status);
               done();
          });

          it('verifyPasswordHash should return false response with invalid pwd and hash', (done) => {
               var result = utils.verifyPasswordHash("AjarSun", "$2a$10$gxV68saAcZXr2P5HLwW/RuD7lninxYDfCzFAdRbQYF1kGBeXnxiea");
               assert.equal(false, result.status);
               done();
          });
     });

     describe('generatePassword', () => {
          it('generatePassword should return pwd', (done) => {
               var result = utils.generatePassword();
               assert.isString(result, 'is String');               
               done();
          });
     });

     describe('verifyJWTtoken', () => {
          // it('verifyJWTtoken should return true response with valid token', async (done) => {
          //      var result = utils.verifyJWTtoken("$2a$10$gxV68saAcZXr2P5HLwW/RuD7lninxYDfCzFAdRbQYF1kGBeXnxiea");
          //      assert.equal(true, result.status);
          //      done();
          // });

          it('verifyJWTtoken should return false response with empty token', async () => {
               var result = await utils.verifyJWTtoken("");
               console.log(result)
               assert.equal(false, result.status);
          });

          it('verifyJWTtoken should return false response with invalid token', async () => {
               var result = await utils.verifyJWTtoken("$2a$10$gxV68saAcZXr2P5HLwW/RuD7lninxYDfCzFAdRbQYF1kGBeXnxiea");
               assert.equal(false, result.status);
          });

          it('verifyJWTtoken should return false response with valid token and empty secret key', async () => {
               var secret = process.env.JWT_SECRET;
               process.env.JWT_SECRET = null;
               var result = await utils.verifyJWTtoken("$2a$10$gxV68saAcZXr2P5HLwW/RuD7lninxYDfCzFAdRbQYF1kGBeXnxiea");
               process.env.JWT_SECRET = secret;
               assert.equal(false, result.status);
          });
     });
});