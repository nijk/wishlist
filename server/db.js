/**
 * wishlist - server/db
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoURL = 'mongodb://localhost:27017/wishlist';

module.exports = {
    connect: (fn) => {
        // Connect using MongoClient
        MongoClient.connect(MongoURL, (err, db) => {
            fn(err, db);
            if (err) { console.info('DB error!', err); }
        });
    }
};