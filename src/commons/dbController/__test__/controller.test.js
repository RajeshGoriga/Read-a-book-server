import {
  expect,
  assert
} from 'chai';

describe('DBController', () => {
  before(() => {});

  after(() => {});

  describe('insert', () => {
    it('insert should return true status with valid collection name and payload', (done) => {
      var collectionName = 'rules';
      var payload = {
        name: "call",
        title: "Number of calls",
        code: "CALL",
        isActive: true
      };

      global.dbController.insert('rules', payload, (response) => {
        assert.equal(true, response.status);
        done();
      })
    });

    it('insert should return false status with invalid collection name and payload', (done) => {
      var collectionName = 'rules';
      var payload = {
        name: "call",
        title: "Number of calls",
        code: "CALL",
        isActive: true
      };

      global.dbController.insert('rule', payload, (response) => {
        assert.equal(false, response.status);
        done();
      })
    });

    it('insert should return false status when connection is null', (done) => {
      var collectionName = 'rules';
      var payload = {
        name: "call",
        title: "Number of calls",
        code: "CALL",
        isActive: true
      };

      var connection = global.dbController.connection;
      global.dbController.connection = null;

      global.dbController.insert('rule', payload, (response) => {
        assert.equal(false, response.status);
        global.dbController.connection = connection;
        done();
      })
    });
  })

  describe('find', () => {
    it('find should return true status with valid collection name', (done) => {
      global.dbController.find('rules', {}, {}, (response) => {
        assert.equal(true, response.status);
        done();
      })
    });

    it('find should return false status with empty collection name', (done) => {
      global.dbController.find('', {}, {}, (response) => {
        assert.equal(false, response.status);
        done();
      })
    });

    it('find should return false status with invalid params', (done) => {
      global.dbController.find('rules', {}, {
        offset: -1,
        limit: -1
      }, (response) => {
        assert.equal(false, response.status);
        done();
      })
    });

    it('find should return false status with invalid params', (done) => {
      global.dbController.find('rule', {}, {
        offset: 0,
        limit: 20
      }, (response) => {
        assert.equal(false, response.status);
        done();
      })
    });

    it('find should return false status when connection is null', (done) => {
      var connection = global.dbController.connection;
      global.dbController.connection = null;

      global.dbController.find('rules', {}, {}, (response) => {
        assert.equal(false, response.status);
        global.dbController.connection = connection;
        done();
      })
    });
  })

  describe('findOne', () => {
    it('findOne should return true status with valid collection name', (done) => {
      global.dbController.findOne('rules', {
        code: 'CALL'
      }, (response) => {
        assert.equal(true, response.status);
        done();
      })
    });

    it('findOne should return false status with empty collection name', (done) => {
      global.dbController.findOne('', {}, (response) => {
        assert.equal(false, response.status);
        done();
      })
    });

    it('findOne should return false status with valid collection name and invalid query', (done) => {
      global.dbController.findOne('rules', {
        code: 'cll'
      }, (response) => {
        assert.equal(false, response.status);
        done();
      })
    });

    it('findOne should return false status when connection is null', (done) => {
      var connection = global.dbController.connection;
      global.dbController.connection = null;

      global.dbController.findOne('rules', {}, (response) => {
        assert.equal(false, response.status);
        global.dbController.connection = connection;
        done();
      })
    });
  })

  describe('update', () => {
    it('update should return true status with valid collection name', (done) => {
      var payload = {
        title: "call"
      };

      global.dbController.update('rules', {
        code: 'CALL'
      }, payload, (response) => {
        assert.equal(true, response.status);
        done();
      })
    });

    it('update should return false status with empty collection name', (done) => {
      var payload = {
        title: "call"
      };

      global.dbController.update('', {
        code: 'CALL'
      }, payload, (response) => {
        assert.equal(false, response.status);
        done();
      })
    });

    it('update should return false status with valid collection name and invalid query', (done) => {
      var payload = {
        title: "call"
      };

      global.dbController.update('rules', {
        code: 'cll'
      }, payload, (response) => {
        assert.equal(false, response.status);
        done();
      })
    });

    it('update should return false status when connection is null', (done) => {
      var connection = global.dbController.connection;
      global.dbController.connection = null;

      global.dbController.update('rules', {}, {}, (response) => {
        assert.equal(false, response.status);
        global.dbController.connection = connection;
        done();
      })
    });
  })

  describe('upsert', () => {
    it('upsert should return true status with valid collection name', (done) => {
      var payload = {
        title: "call"
      };
      global.dbController.upsert('rules', {
        code: 'CALL'
      }, payload, (response) => {
        assert.equal(true, response.status);
        done();
      })
    });

    it('upsert should return false status with invalid collection name', (done) => {
      var payload = {
        title: "call"
      };
      global.dbController.upsert('rul', {
        code: 'CALL'
      }, payload, (response) => {
        assert.equal(false, response.status);
        done();
      })
    });

    it('upsert should return false status with valid collection name and invalid query', (done) => {
      var payload = {
        title: "call"
      };
      global.dbController.upsert('rules', {
        codes: 'C'
      }, payload, (response) => {
        assert.equal(false, response.status);
        done();
      })
    });

    it('upsert should return false status with empty collection name', (done) => {
      var payload = {
        title: "call"
      };
      global.dbController.upsert('', {
        code: 'CALL'
      }, payload, (response) => {
        assert.equal(false, response.status);
        done();
      })
    });

    it('upsert should return false status when connection is null', (done) => {
      var connection = global.dbController.connection;
      global.dbController.connection = null;

      global.dbController.upsert('rules', {}, {}, (response) => {
        assert.equal(false, response.status);
        global.dbController.connection = connection;
        done();
      })
    });
  })

  describe('aggregate', () => {
    it('aggregate should return true status with valid collection name and query', (done) => {
      var query = {
        $lookup: {
          from: "userlogin",
          localField: "_id",
          foreignField: "userid",
          as: "userlogin"
        }
      };

      global.dbController.aggregate('users', query, (response) => {
        assert.equal(true, response.status);
        done();
      })
    });

    it('aggregate should return false status with invalid collection name and query', (done) => {
      var query = {
        $lookup: {
          from: "userlogin",
          localField: "_id",
          foreignField: "userid",
          as: "userlogin"
        }
      };
      global.dbController.aggregate('user', query, (response) => {
        assert.equal(true, response.status);
        done();
      })
    });


    it('aggregate should return false status when connection is null', (done) => {
      var connection = global.dbController.connection;
      global.dbController.connection = null;

      global.dbController.aggregate('rules', {}, (response) => {
        assert.equal(false, response.status);
        global.dbController.connection = connection;
        done();
      })
    });

    it('aggregate should return false status with invalid collection name and without query', (done) => {
      var query = {};
      global.dbController.aggregate('user', query, (response) => {
        assert.equal(false, response.status);
        done();
      })
    });
  })

  describe('convertIdToObjectID', () => {
    it('convertIdToObjectID should return true  with Valid mongo object Id', (done) => {
      var id = "5a2a35486e50a82869e55651";
      var result = global.dbController.convertIdToObjectID(id);
      expect(result).to.be.an('object');

      done();
    });

    it('convertIdToObjectID should return false with Invalid Id', (done) => {
      var id = null;
      var result = global.dbController.convertIdToObjectID(id);
      expect(result).to.not.an('object');

      done();
    });

  });


});