/**
 * The DBController Class holds all db related operations
 * @author  Rajesh Goriga
 * @version 1.0
 */

import mongoConfig from './index'
var ObjectID = require('mongodb').ObjectID;
var errorHelper = require('mongoose-error-helper').errorHelper;

export default class DBController {
    constructor() {
        this.connection = mongoConfig.getConnection();
    }

    /**
     * The insert method will insert document in  given collection name
     * @param collectionName: mongoose collection name
     * @param payload: document to insert
     * @context: Quried user context 
     * @author  Rajesh Goriga
     * @version 1.0
     */
    insert(collectionName, payload, cb) {
        try {
            new this.connection.models[collectionName](payload).save((err, doc) => {
                if (err) {
                    var message = '';
                    for (var key in err.errors) {
                        message = err.errors[key].message;
                        console.log("message", err.errors[key].message)
                    }
                    cb && cb({
                        status: false,
                        result: {
                            message: message
                        }
                    });
                } else {
                    cb && cb({
                        status: true,
                        result: {
                            data: doc._doc._id.toString()
                        }
                    });
                }
            });
        } catch (e) {
            cb && cb({
                status: false,
                result: {
                    message: e.message
                }
            });
        }
    }

    /**
     * The find method will fetch array of records based on the input query
     * @param collectionName: mongoose collection name
     * @param query: mongoose query
     * @param cb: callback to return db response 
     * @author  Rajesh Goriga
     * @version 1.0
     */
    find(collectionName, query, params, cb) {
        try {
            if (!collectionName) {
                cb && cb({
                    status: false,
                    result: {
                        message: 'CollectionName is required'
                    }
                });
                return;
            }
            this.connection.models[collectionName].find(query).skip(parseInt(params.offset)).limit(parseInt(params.limit)).sort(params.sort).exec((err, docs) => {
                if (err) {
                    cb && cb({
                        status: false,
                        result: {
                            message: err
                        }
                    });
                } else {
                    cb && cb({
                        status: true,
                        result: {
                            data: docs
                        }
                    });
                }
            });
        } catch (e) {
            cb && cb({
                status: false,
                result: {
                    message: e.message
                }
            });
        }
    }

    /**
     * The search method will fetch array of records based on the input query
     * @param collectionName: mongoose collection name
     * @param query: mongoose query
     * @param cb: callback to return db response 
     * @author  Rajesh Goriga
     * @version 1.0
     */
    search(collectionName, query, cb) {
        try {
            if (!collectionName) {
                cb && cb({
                    status: false,
                    result: {
                        message: 'CollectionName is required'
                    }
                });
                return;
            }
            this.connection.models[collectionName].find(query).exec((err, docs) => {
                if (err) {
                    cb && cb({
                        status: false,
                        result: {
                            message: err
                        }
                    });
                } else {
                    cb && cb({
                        status: true,
                        result: {
                            data: docs
                        }
                    });
                }
            });
        } catch (e) {
            cb && cb({
                status: false,
                result: {
                    message: e.message
                }
            });
        }
    }

    /**
     * The findOne method will find record based on the input query
     * @param collectionName: mongoose collection name
     * @param query: mongoose query
     * @param cb: callback to return db response
     * @author  Rajesh Goriga
     * @version 1.0
     */
    findOne(collectionName, query, cb) {
        try {
            this.connection.models[collectionName].findOne(query, (err, doc) => {
                if (err || doc == null) {
                    cb && cb({
                        status: false,
                        result: {
                            message: err || "Document Not Found"
                        }
                    });
                } else {
                    cb && cb({
                        status: true,
                        result: {
                            data: doc
                        }
                    });
                }
            });
        } catch (e) {
            console.log("e", e)
            cb && cb({
                status: false,
                result: {
                    message: e.message
                }
            });
        }
    }

    /**
     * The update method will update record based on the input query
     * @param collectionName: mongoose collection name
     * @param query: mongoose query
     * @param payload: data to update
     * @param cb: callback to return db response
     * @author  Rajesh Goriga
     * @version 1.0
     */
    update(collectionName, query, payload, cb) {
        var resp = {};
        try {
            this.connection.models[collectionName].findOneAndUpdate(query, {
                $set: payload
            }).exec((err, doc) => {
                if (err || doc == null) {
                    resp = {
                        status: false,
                        message: "Unable to update"
                    }
                } else {
                    resp = {
                        status: true,
                        result: {
                            data: doc
                        }
                    };
                }
                cb && cb(resp)
            });
        } catch (e) {
            console.log(e.message);
            var error = {
                status: false,
                message: e.message
            }
            cb && cb(error);
        }
    }


    /**
     * The increment method will update record based on the input query
     * @param collectionName: mongoose collection name
     * @param query: mongoose query
     * @param payload: data to increment value
     * @param cb: callback to return db response
     * @author  Rajesh Goriga
     * @version 1.0
     */
    increment(collectionName, query, payload, cb) {
        var resp = {};
        try {
            this.connection.models[collectionName].update(query, {
                $inc: payload
            }).exec((err, doc) => {
                if (err || doc == null) {
                    resp = {
                        status: false,
                        message: "Unable to increment"
                    }
                } else {
                    resp = {
                        status: true,
                        result: {
                            data: doc
                        }
                    };
                }
                cb && cb(resp)
            });
        } catch (e) {
            console.log(e.message);
            var error = {
                status: false,
                message: e.message
            }
            cb && cb(error);
        }
    }


    /**
     * The pushArray method will update record based on the input query
     * @param collectionName: mongoose collection name
     * @param query: mongoose query
     * @param payload: data to increment value
     * @param cb: callback to return db response
     * @author  Rajesh Goriga
     * @version 1.0
     */
    arrayUpdate(collectionName, query, payload, cb) {
        var resp = {};
        try {
            this.connection.models[collectionName].update(query, payload).exec((err, doc) => {
                console.log('err', err);
                if (err || doc == null) {
                    resp = {
                        status: false,
                        message: "Unable to increment"
                    }
                } else {
                    resp = {
                        status: true,
                        result: {
                            data: doc
                        }
                    };
                }
                cb && cb(resp)
            });
        } catch (e) {
            console.log(e.message);
            var error = {
                status: false,
                message: e.message
            }
            cb && cb(error);
        }
    }


    /**
     * The upsert method will update record / create if record not availiable based on the input query
     * @param collectionName: mongoose collection name
     * @param query: mongoose query
     * @param payload: data to update / insert
     * @param cb: callback to return db response
     * @author  Rajesh Goriga
     * @version 1.0
     */
    upsert(collectionName, query, payload, cb) {
        try {
            this.connection.models[collectionName].findOneAndUpdate(query, payload, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }).exec((err, doc) => {
                if (err || doc == null) {
                    cb && cb({
                        status: false,
                        result: {
                            message: err
                        }
                    });
                } else {
                    cb && cb({
                        status: true,
                        result: {
                            data: doc._doc._id
                        }
                    });
                }
            });
        } catch (e) {
            console.log(e.message);
            cb && cb({
                status: false,
                result: {
                    message: e.message
                }
            });
        }
    }

    /**
     * The aggregate method will join collections and give mixed output based on the input query
     * @param collectionName: mongoose collection name
     * @param query: mongoose query
     * @param cb: callback to return db response
     * @author  Rajesh Goriga
     * @version 1.0
     */
    aggregate(collectionName, query, cb) {
        try {
            this.connection.models[collectionName].aggregate(query, (err, doc) => {
                if (err || doc == null) {
                    cb && cb({
                        status: false,
                        result: {
                            message: "No Records Found"
                        }
                    });
                } else {
                    cb && cb({
                        status: true,
                        result: {
                            data: doc
                        }
                    });
                }
            });
        } catch (e) {
            console.log(e);
            cb && cb({
                status: false,
                result: {
                    message: e.message
                }
            });
        }
    }

    /**
     * The convertIdToObjectID method will convert _id to object
     * @param id: doc id
     * @author  Rajesh Goriga
     * @version 1.0
     */
    convertIdToObjectID(id) {
        if (!id) {
            return id;
        }
        return new ObjectID(id); // wrap in ObjectID
    }

    /**
     * The count method will fetch count of records based on the input query
     * @param collectionName: mongoose collection name
     * @param query: mongoose query
     * @param cb: callback to return db response 
     * @author  Rajesh Goriga
     * @version 1.0
     */
    count(collectionName, query, cb) {
        try {
            if (!collectionName) {
                cb && cb({
                    status: false,
                    result: {
                        message: 'CollectionName is required'
                    }
                });
                return;
            }
            this.connection.models[collectionName].count(query).exec((err, docs) => {
                if (err) {
                    cb && cb({
                        status: false,
                        result: {
                            message: err
                        }
                    });
                } else {
                    cb && cb({
                        status: true,
                        result: {
                            data: docs
                        }
                    });
                }
            });
        } catch (e) {
            cb && cb({
                status: false,
                result: {
                    message: e.message
                }
            });
        }
    }
}