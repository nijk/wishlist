/**
 * wishlist - server/db
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoURL = 'mongodb://localhost:27017/';
const Promise = require('native-promise-only');
const assert = require('assert');
const queryLimit = 10;

/**
 * Get the name of the DB based on the user/resource combination
 * @param user
 * @param resource
 */
const getDBName = ({ user, resource }) => `${user}-${resource}`;

/**
 * Connect using MongoClient
 * @param dbName
 */
const connectDB = ({ user, resource }) => {
    const dbName = getDBName({ user, resource });

    return new Promise((resolve, reject) => {
        MongoClient.connect(MongoURL + dbName, (err, db) => {
            if (err) return reject(err);
            resolve(db);
        })
    });
};

module.exports = {
    createCollection: ({ user, resource, collection }) => new Promise((resolve, reject) => {
        connectDB({ user, resource })
            .then((db) => {
                db.createCollection(collection)
                    .then(() => {
                        db.close();
                        resolve(collection);
                    })
                    .catch((err) => {
                        db.close();
                        return reject({ msg: 'DB:createCollection error!', err: err });
                    });
            })
            .catch((err) => {
                db.close();
                return reject({ msg: 'DB:createCollection error!', err: err });
            });
    }),
    createDocument: ({ user, resource, collection, doc }) => new Promise((resolve, reject) => {

        console.info('createDocument', user, resource, collection, doc);

        connectDB({ user, resource })
            .then((db) => {
                db.collection(collection)
                    .insertOne(doc)
                    .then((result) => {
                        db.close();
                        resolve(result);
                    });
            })
            .catch((err) => {
                db.close();
                return reject({ msg: 'DB:createDocument error!', err: err });
            });
    }),
    retrieveCollections: ({ user, resource, pageNum }) => new Promise((resolve, reject) => {
        connectDB({ user, resource })
            .then((db) => db.listCollections({ name: { $not: /^system.*/ } }).toArray()
            .then((collections) => {
                db.close();
                resolve(collections);
            }))
            .catch((err) => {
                db.close();
                return reject({ msg: 'DB:retrieveCollections error!', err });
            });
    }),
    retrieveDocuments: ({ user, resource, collection, pageNum }) => new Promise((resolve, reject) => {
        connectDB({ user, resource })
            .then((db) => {
                db.collection(collection)
                    .find({})
                    .sort({_id: -1})
                    .skip((pageNum -1) * queryLimit)
                    /*.limit(queryLimit)*/
                    .toArray()
                    .then((docs) => {
                        db.close();
                        resolve(docs);
                    });
            })
            .catch((err) => {
                db.close();
                return reject({ msg: 'DB:retrieveDocuments error!', err });
            });
    })
};