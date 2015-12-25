/**
 * wishlist - test/api.test.js
 *
 * Created by nijk on 21/11/2015.
 */

'use strict';

// const _ = require('lodash');
const sandbox = require('sinon').sandbox.create();
const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const common = require('./common');

let agent;
let stubs = {
        csrf: sandbox.stub().returns((req, res, next) => {
            req.csrfToken = () => '123';
            next();
        }),
        DB: {
            createCollection: sandbox.stub().returns(common.promise(null, { msg: 'DB.createCollection not stubbed' })),
            retrieveCollections: sandbox.stub().returns(common.promise(null, { msg: 'DB.retrieveCollections not stubbed' })),
            retrieveDocuments: sandbox.stub().returns(common.promise(null, { msg: 'DB.retrieveDocuments not stubbed' }))
        },
        ogScraper: {
            error: sandbox.stub().returns(null),
            result: sandbox.stub().returns({
                success: true,
                opengraph: true,
                data: { ogSiteName: 'FooBar' }
            })
        }
    };

/**
 * Mocks to use
 * @type Oject literal
 *   Key: Module (require) name/path
 *   Value: Export value to mock
 */
const mocks = {
    'csurf': stubs.csrf,
    'open-graph-scraper': ({}, callback) => {
        return callback(stubs.ogScraper.error(), stubs.ogScraper.result());
    },
    './db': stubs.DB
};

/**
 * Callback used once Chai Agent has been setup.
 * @param chaiAgent
 */
const agentCallback = (chaiAgent) => agent = chaiAgent;

/**
 * SetUp wrapper
 */
const setUp = () => common.setUp({ mocks, agentCallback });

describe('API', function () {
    before(function () {
        setUp();
    });
    after(common.tearDown);

    it('should set a session cookie', function (done) {
        agent.get('/')
            .end((err, res) => {
                expect(res).to.have.cookie('connect.sid');
                common.done(done)(err, res);
            });
    });

    describe('CSRF', function () {
        it('should return a token as a string', function (done) {
            agent.get('/api/token')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.token).to.be.a('string');
                    common.done(done)(err, res);
                });
        });
    });

    describe('ProductURL', function () {
        it('should accept a URI encoded param', function (done) {
            const url = encodeURIComponent('http://foo.bar');
            agent.get(`/api/product/${url}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    common.done(done)(err, res);
                });
        });

        it('should return an object containing Open Graph data', function (done) {
            const url = encodeURIComponent('http://foo.bar');
            agent.get(`/api/product/${url}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.have.deep.property('ogSiteName', 'FooBar');
                    common.done(done)(err, res);
                });
        });

        it('should return 500 on failure', function (done) {
            stubs.ogScraper.error.returns({ status: 500 });
            stubs.ogScraper.result.returns({ err: 'Forced 500 error' });

            const url = encodeURIComponent('http://foo.bar');
            agent.get(`/api/product/${url}`)
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    common.done(done)(err, res);
                });
        });
    });

    describe('Invalid resource', function () {
        it('should return a 400 for invalid resource', function (done) {
            agent.get('/api/invalid')
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('msg', 'API Error: Invalid resource');
                    common.done(done)(err, res);
                });
        });
    });

    describe('Wishlists resource', function () {
        // @todo: get this working
        it.skip('should return all collections', (done) => {
            const resolve = { data: [ { foo: 'bar' }, { baz: 'qux' } ] };
            stubs.DB.retrieveDocuments.returns(common.promise(resolve));
            setUp();

            agent.get('/api/wishlists')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('Array');
                    common.done(done)(err, res);
                });
        });

        it('should return a valid collection', function (done) {
            const resolve = { data: { foo: 'bar' } };
            stubs.DB.retrieveDocuments.returns(common.promise(resolve));
            setUp();

            agent.get('/api/wishlists/valid')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.have.property('foo', 'bar');
                    common.done(done)(err, res);
                });
        });

        it('should refuse an invalid collection', function (done) {
            // @todo: switch this to user/wishlist based validation
            const reject = { baz: 'qux' };
            stubs.DB.retrieveDocuments.returns(common.promise(null, reject));
            setUp();

            agent.get('/api/wishlists/invalid')
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('msg', 'API Error: Invalid collection');
                    common.done(done)(err, res);
                });
        });
        it('should create a collection', function (done) {
            const resolve = 'foo';
            stubs.DB.createCollection.returns(common.promise(resolve));
            setUp();

            agent.post('/api/wishlists')
                .send({ item: { name: 'foo' } })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.have.header('location', '/api/wishlists/foo//');
                    common.done(done)(err, res);
                });
        });

        it('should return collections', (done) => {
            const resolve = { data: [{ foo: 'bar' }, { baz: 'qux' }] };
            stubs.DB.retrieveCollections.returns(common.promise(resolve));
            setUp();

            agent.get('/api/wishlists')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.deep.equal([{ foo: 'bar' }, { baz: 'qux' }]);
                    common.done(done)(err, res);
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
