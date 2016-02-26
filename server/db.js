/**
 * wishlist - server/db
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

// Config
const config = {
    port: 27017,
    hostname: 'localhost',
    defaultDB: 'wishlist'
};
config.url = `mongodb://${config.hostname}:${config.port}/`;

// Dependencies
const _ = require('lodash');
const MongoDB = require('mongodb');
const Promise = require('native-promise-only');

/**
 * Connect using MongoClient
 * @param dbName
 */
const connectDB = (dbName) => {
    dbName = dbName || config.defaultDB;

    return new Promise((resolve, reject) => {
        MongoDB.MongoClient.connect(config.url + dbName, {}, (err, db) => {
            if (err) return reject(err);
            resolve(db);
        });
    });
};

const connectionErrorHandler = (err) => reject({ msg: 'DB:connection error', code: 500, err: err });
const queryErrorHandler = (db, msg, code, err) => {
    const result = {
        msg: `DB: ${msg || 'query error'}`,
        code: code || 500,
        err: err || {}
    };

    db.close();
    reject(result);
};

module.exports = {
    _config: config,
    authenticateUser: ({ email, password }) => new Promise((resolve, reject) => {
        connectDB()
            .then((db) => {
                db.collection('users')
                    .find({ email })
                    .limit(1)
                    .toArray()
                    .then((user) => {
                        user = user[0];
                        db.close();
                        resolve(user);
                    })
                    .catch(queryErrorHandler.bind(null, db, 'authenticateUser error'));
            })
            .catch(connectionErrorHandler);
    }),
    createCollection: ({ dbName = null, user, resource, collection }) => new Promise((resolve, reject) => {
        connectDB(dbName)
            .then((db) => {
                db.createCollection(collection)
                    .then(() => {
                        db.close();
                        resolve(collection);
                    })
                    .catch(queryErrorHandler.bind(null, db, 'createCollection error'));
            })
            .catch(connectionErrorHandler);
    }),
    createDocument: ({ dbName = null, user, resource, collection, doc }) => new Promise((resolve, reject) => {
        connectDB(dbName)
            .then((db) => {
                db.collection(collection)
                    .insertOne(doc)
                    .then((result) => {
                        db.close();
                        resolve(result);
                    })
                    .catch(queryErrorHandler.bind(null, db, 'createDocument error'));
            })
            .catch(connectionErrorHandler);
    }),
    updateDocument: ({ dbName = null, user, resource, collection, doc }) => new Promise((resolve, reject) => {
        connectDB(dbName)
            .then((db) => {
                db.collection(collection)
                    .update({ _id: MongoDB.ObjectId(doc._id) }, _.omit(doc, '_id'))
                    .then((result) => {
                        db.close();
                        resolve(result);
                    })
                    .catch(queryErrorHandler.bind(null, db, 'updateDocument error'));
            })
            .catch(connectionErrorHandler);
    }),
    removeDocument: ({ dbName = null, user, resource, collection, id }) => new Promise((resolve, reject) => {
        connectDB(dbName)
            .then((db) => {
                db.collection(collection)
                    .remove({ _id: MongoDB.ObjectId(id) }, 1)
                    .then((result) => {
                        db.close();
                        resolve(result);
                    })
                    .catch(queryErrorHandler.bind(null, db, 'removeDocument error'));
            })
            .catch(connectionErrorHandler);
    }),
    retrieveDocuments: ({ dbName, user, resource, collection, find = {}, page = 1, limit = 1 }) => new Promise((resolve, reject) => {
        connectDB(dbName)
            .then((db) => {
                if ('users' !== collection) {
                    //find = _.merge({ uid: user._id }, find);
                    if (!user || !user._id) return queryErrorHandler.bind(null, db, 'retrieveDocuments missing user._id');
                }

                if (find._id) {
                    find._id = MongoDB.ObjectId(find._id);
                }

                db.collection(collection)
                    .find(find)
                    .sort({_id: -1})
                    .skip((page -1) * limit)
                    .limit(limit)
                    .toArray()
                    .then((docs) => {
                        db.close();
                        resolve(docs);
                    })
                    .catch(queryErrorHandler.bind(null, db, 'retrieveDocuments error'));
            })
            .catch(connectionErrorHandler);
    })
};