/**
 * wishlist - server/db
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoURL = 'mongodb://localhost:27017/wishlist';
const Promise = require('native-promise-only');

const connectDB = () => {
    // Connect using MongoClient
    return new Promise((resolve, reject) => MongoClient.connect(MongoURL, (err, db) => {
        if (err) {
            return reject(err);
        }
        resolve(db);
    }));
};

module.exports = {
    insertDocument: (res, collection, data) => {
        return new Promise((resolve, reject) => {
            connectDB()
                .then((db) => {
                    return db.collection(collection).insertOne(data);
                })
                .then((DBResponse) => {
                    resolve(res.json(DBResponse.ops));
                })
                .catch((e) => {
                    res.status(500);
                    reject(res.json({ msg: 'DB:insertDocument connectDB error!', err: e }));
                });
        });
    }
};