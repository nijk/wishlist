/**
 * wishlist - test/api.test.js
 *
 * Created by nijk on 21/11/2015.
 */

'use strict';
const _ = require('lodash');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mockery = require('mockery');
const app = require('express')();

let agent;

/**
 * Setup Express App with required config for testing
 */
const setUpExpress = () => {
    // Setup app with API & Config
    require('../server/config')(app);
    require('../server/api')(app);

    // Setup app fake static response to get session cookie
    app.get('/', (req, res) => res.json({}) );
};

/**
 * Setup Chai Agent to use App configuration
 * @param done
 */
const setUpAgent = (done) => {
    if (!agent) {
        chai.use(chaiHttp);
        agent = chai.request.agent(app);
        done(agent);
    }
};

module.exports = {
    done: (next) => ((err, res) => {
        if (err) throw new Error(err);
        next(err, res);
    }),
    promise: (resolveWith, rejectWith) => new Promise((resolve, reject) => {
        if (rejectWith) reject(rejectWith);
        resolve(resolveWith);
    }),
    setUp: ({ mocks, express = true, agentCallback }) => {
        if (mocks instanceof Object) {
            mockery.enable({ warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true });
            _.each(mocks, (mock, key) => mockery.registerMock(key, mock));
        }
        if (express) setUpExpress();
        if (agentCallback) {
            setUpAgent(agentCallback);
        }
    },
    tearDown: () => {
        agent = undefined;
        mockery.disable();
    }
};