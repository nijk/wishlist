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
 * Get the name of the DB based on the user/resource combination
 * @param user
 * @param resource
 */
const getDBName = ({ user, resource }) => `${user}-${resource}`;

/**
 * Connect using MongoClient
 * @param dbName
 */
const connectDB = ({ dbName = null, user = null, resource = null }) => {


    if (!dbName && !user && !resource) {
        dbName = config.defaultDB;
    }

    if (!dbName && user && resource) {
        dbName = getDBName({ user, resource });
    }


    return new Promise((resolve, reject) => {
        console.info('MongoDB.MongoClient.connect', config.url + dbName, dbName);
        MongoDB.MongoClient.connect(config.url + dbName, (err, db) => {
            if (err) return reject(err);
            resolve(db);
        });
    });
};

module.exports = {
    _config: config,
    authenticateUser: ({ email, password }) => new Promise((resolve, reject) => {

        console.info('DB:authenticateUser', email, password);

        connectDB({ dbName: 'wishlist' })
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
                    .catch((err) => {
                        db.close();
                        return reject({ msg: 'DB:authenticateUser error!', err: err });
                    });
            })
            .catch((err) => {
                db.close();
                return reject({ msg: 'DB:authenticateUser error!', err: err });
            });
    }),
    createCollection: ({ dbName = null, user, resource, collection }) => new Promise((resolve, reject) => {
        connectDB({ dbName, user, resource })
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
    createDocument: ({ dbName = null, user, resource, collection, doc }) => new Promise((resolve, reject) => {
        connectDB({ dbName, user, resource })
            .then((db) => {
                db.collection(collection)
                    .insertOne(doc)
                    .then((result) => {
                        db.close();
                        resolve(result);
                    })
                    .catch((err) => {
                        db.close();
                        return reject({ msg: 'DB:createDocument error!', err: err });
                    });
            })
            .catch((err) => {
                db.close();
                return reject({ msg: 'DB:createDocument error!', err: err });
            });
    }),
    updateDocument: ({ dbName = null, user, resource, collection, doc }) => new Promise((resolve, reject) => {
        connectDB({ dbName, user, resource })
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
    removeDocument: ({ dbName = null, user, resource, collection, id }) => new Promise((resolve, reject) => {
        connectDB({ dbName, user, resource })
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
    retrieveCollections: ({ dbName = null, user, resource, page, limit }) => new Promise((resolve, reject) => {

        console.info('retrieveCollections', dbName, user, resource);

        connectDB({ dbName, user, resource })
            .then((db) => {

                console.info('listCollections', db);

                db.listCollections({ name: { $not: /^system.*/ } })
                    .toArray()
                    .then((collections) => {
                        db.close();
                        resolve(collections);
                    })
                    .catch((err) => {
                        db.close();
                        return reject(_.merge(err, { msg: 'DB:retrieveCollections error!' }));
                    });
            }, (err) => console.log(err))
            .catch((err) => {
                db.close();
                return reject(_.merge(err, { msg: 'DB:retrieveCollections error!' }));
            });
    }),
    retrieveDocuments: ({ dbName = null, user, resource, collection, find = {}, page = 1, limit = 1 }) => new Promise((resolve, reject) => {
        connectDB({ dbName, user, resource })
            .then((db) => {

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
                    .catch((err) => {
                        db.close();
                        return reject(_.merge(err, { msg: 'DB:retrieveDocuments error!' }));
                    });
            })
            .catch((err) => {
                db.close();
                return reject(_.merge(err, { msg: 'DB:retrieveDocuments error!' }));
            });
    })
};