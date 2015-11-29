/**
 * wishlist - test/api.test.js
 *
 * Created by nijk on 21/11/2015.
 */

'use strict';

const _ = require('lodash');
const sandbox = require('sinon').sandbox.create();
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mockery = require('mockery');
const app = require('express')();
/*const session = require('supertest-session');*/

chai.use(chaiHttp);

const endAsyncTest = (next) => ((err, res) => {
    if (err) throw new Error(err);
    next(err, res);
});


describe('API', () => {
    let agent, stubs = {};

    before(() => {
        mockery.enable({ warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true })
    });
    after(() => mockery.disable());

    beforeEach(() => {
        // Setup mocks
        const ogScraperMock = ({}, done) => {
            done(null, {
                success: true,
                opengraph: true,
                data: { ogSiteName: 'SoundCloud' }
            })
        };

        // Register mocks
        mockery.registerMock('open-graph-scraper', ogScraperMock);

        // Setup app with API & Config, adding mocks from above
        require('../server/config')(app);
        require('../server/api')(app);

        // Setup app fake static response to get session cookie
        app.get('/', (req, res) => {
            res.json({});
        });
        
        // Setup Chai Agent to use App configuration
        agent = chai.request.agent(app);
        
    });

    it('should set a session cookie', (done) => {
        agent.get('/')
            .end((err, res) => {
                expect(res).to.have.cookie('connect.sid');
                endAsyncTest(done)(err, res);
            });
    });

    describe('CSRF', () => {
        it('should return a token as a string', (done) => {
            agent.get('/api/token')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.token).to.be.a('string');
                    endAsyncTest(done)(err, res);
                });
        });
    });

    describe('Fetch Product from URL', () => {
        it('should accept a URI encoded param', (done) => {
            const url = encodeURIComponent('http://google.com');
            agent.get(`/api/product/${url}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    endAsyncTest(done)(err, res);
                });
        });

        it('should return an object containing Open Graph data', (done) => {
            const url = encodeURIComponent('http://www.soundcloud.com');
            agent.get(`/api/product/${url}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.have.deep.property('ogSiteName', 'SoundCloud');
                    endAsyncTest(done)(err, res);
                });
        });

        it('should return 500 on failure', (done) => {
            mockery.deregisterMock('open-graph-scraper');
            mockery.registerMock('open-graph-scraper', ({}, done) => done({ status: 500 }));
            // @fixme: no way to override mocks in specs :(

            const url = encodeURIComponent('http://foo.bar');
            agent.get(`/api/product/${url}`)
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    endAsyncTest(done)(err, res);
                });
        });
    });

    /*describe('Save Wishlist item', () => {
        it('should accept a wishlist route', (done) => {

        });

        it('should accept an item to save', (done) => {

        });

        it('should return the item on success', (done) => {

        });

        it('should return error object on failure', (done) => {

        });
    });*/
});
