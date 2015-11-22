/**
 * wishlist - server/db
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoURL = 'mongodb://localhost:27017/wishlist';
const Promise = require('native-promise-only');
const assert = require('assert');
const queryLimit = 10;

// Connect using MongoClient
const connectDB = () => new Promise((resolve, reject) => MongoClient.connect(MongoURL, (err, db) => {
    if (err) return reject(err);
    resolve(db);
}));

module.exports = {
    createDocument: ({ user, collection, doc }) => new Promise((resolve, reject) => {
        connectDB()
            .then((db) => {
                db.collection(collection)
                    .insertOne(doc, (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
            })
            .catch((err) => {
                db.close();
                return reject({ msg: 'DB:createDocument error!', err: err });
            });
    }),
    retrieveDocuments: (collection, pageNum) => new Promise((resolve, reject) => {
        connectDB()
            .then((db) => {
                db.collection(collection)
                    .find({})
                    .sort({_id: -1})
                    .skip((pageNum -1) * queryLimit)
                    /*.limit(queryLimit)*/
                    .toArray((err, docs) => {
                        if (err) return reject({ err });
                        db.close();
                        resolve(docs);
                    });
            })
            .catch((err) => {
                db.close();
                res.status(500);
                return reject({ msg: 'DB:retrieveDocuments error!', err });
            });
    })
};