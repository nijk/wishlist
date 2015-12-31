/**
 * wishlist - server/db
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const _ = require('lodash');
const MongoDB = require('mongodb');
const MongoURL = 'mongodb://localhost:27017/';
const Promise = require('native-promise-only');
const assert = require('assert');

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
        MongoDB.MongoClient.connect(MongoURL + dbName, (err, db) => {
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
    updateDocument: ({ user, resource, collection, doc }) => new Promise((resolve, reject) => {
        connectDB({ user, resource })
            .then((db) => {
                db.collection(collection)
                    .update({ _id: MongoDB.ObjectId(doc._id) }, _.omit(doc, '_id'))
                    .then((result) => {
                        db.close();
                        resolve(result);
                    })
                    .catch((err) => {
                        db.close();
                        return reject({ msg: 'DB:updateDocument error!', err: err });
                    });
            })
            .catch((err) => {
                db.close();
                return reject({ msg: 'DB:updateDocument error!', err: err });
            });
    }),
    removeDocument: ({ user, resource, collection, id }) => new Promise((resolve, reject) => {
        connectDB({ user, resource })
            .then((db) => {
                db.collection(collection)
                    .remove({ _id: MongoDB.ObjectId(id) }, 1)
                    .then((result) => {
                        db.close();
                        resolve(result);
                    })
                    .catch((err) => {
                        db.close();
                        return reject({ msg: 'DB:removeDocument error!', err: err });
                    });
            })
            .catch((err) => {
                db.close();
                return reject({ msg: 'DB:removeDocument error!', err: err });
            });
    }),
    retrieveCollections: ({ user, resource, page, limit }) => new Promise((resolve, reject) => {
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
    retrieveDocuments: ({ user, resource, collection, page, limit }) => new Promise((resolve, reject) => {
        connectDB({ user, resource })
            .then((db) => {
                db.collection(collection)
                    .find({})
                    .sort({_id: -1})
                    .skip((pageNum -1) * limit)
                    .limit(queryLimit)
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