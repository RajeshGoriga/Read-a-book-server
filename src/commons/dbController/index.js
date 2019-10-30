import mongoose from 'mongoose'
import config from '../../config/index'
import fs from 'fs'

mongoose.Promise = global.Promise;

class MongoConfig {
    constructor() {
        this.connection = null;
        // this.uri = config.dbConfig.uri;
        this.opts = config.dbConfig.options;
    }

    async connect(uri) {
        try {
            let conn = await mongoose.connect(uri, this.opts);

            // Events
            conn.on('disconnected', (err) => {
                console.log(`MongoDB-> disconnected: ${uri}`);
                connect();
            });

            conn.on('reconnected', (err) => {
                console.log(`MongoDB-> reconnected: ${uri}`);
            });

            // Success
            console.log(`-------\nMongoDB-> connected on ${uri}\n-------`);
            this.connection = conn;

        } catch (err) {
            console.log(`MongoDB-> connection error: ${uri} details->${err}`);
            process.exit(-1);
        }
    }

    getConnection() {
        return this.connection;
    }
}

var mongoConfig = new MongoConfig();
export default mongoConfig