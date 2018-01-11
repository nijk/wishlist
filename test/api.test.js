/**
 * wishlist - test/api.test.js
 *
 * Created by nijk on 21/11/2015.
 */

// const _ = require('lodash');
// const mockery = require('mockery');
// const chai = require('chai');
import API from '../server/api';
import { describe, it, before, after } from 'mocha';
import sinon from 'sinon';
import common from './common';
import { apiRoute, ROUTES } from '../common/enums.api';

const chai = require('chai');
const expect = chai.expect;

const sandbox = sinon.sandbox.create();

process.env.NODE_ENV = 'test';

let agent;
let stubs = {
  csrf: sandbox.stub().returns((req, res, next) => {
    req.csrfToken = () => '123';
    next();
  }),
  DB: {
    authenticateUser: sandbox.stub().returns(common.promise({ _id: 'foo', email: 'a@b.com' })),
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
 * @type Object literal
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

describe('API', () => {
    before(setUp);
    after(common.tearDown);

    // describe.skip('CSRF', function () {
    //     it('should return a token as a string', function (done) {
    //         agent.get(`${apiRoute}/token`)
    //             .end((err, res) => {
    //                 expect(res).to.have.status(200);
    //                 expect(res.body.token).to.be.a('string');
    //                 common.done(done)(err, res);
    //             });
    //     });
    // });

    describe('Login success', () => {
      it('should return a 200', (done) => {
        agent.post(ROUTES.LOGIN)
          .set('content-type', 'application/json')
          .send({ email: 'test3', password: 'test' }).end((err, res) => {
            expect(res).to.have.status(200);
            common.done(done)(err, res);
          });
      });

      it('should return headers', (done) => {
        agent.post(ROUTES.LOGIN)
          .set('content-type', 'application/json')
          .send({ email: 'test3', password: 'test' }).end((err, res) => {
            expect(res).to.have.header('x-xss-protection', '1; mode=block');
            common.done(done)(err, res);
          });
      });
    });

    describe('ProductURL', function () {
      it('should accept a URI encoded param', function (done) {
        const url = encodeURIComponent('https://google.com');
        agent.get(`${apiRoute}/lookup/${url}`)
          .set('content-type', 'application/json')
          .end((err, res) => {
            expect(res).to.have.status(200);
            common.done(done)(err, res);
          });
      });

      it('should return an object containing Open Graph data', function (done) {
        const url = encodeURIComponent('http://opengraphcheck.com');
        agent.get(`${apiRoute}/lookup/${url}`)
          .set('content-type', 'application/json')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.data).to.have.deep.property('ogSiteName', 'OpenGraphCheck.com');
            common.done(done)(err, res);
          });
      });

      it('should return 500 on failure', function (done) {
        stubs.ogScraper.error.returns({ status: 500 });
        stubs.ogScraper.result.returns({ err: 'Forced 500 error' });

        const url = encodeURIComponent('http://foo.bar');
        agent.get(`${apiRoute}/lookup/${url}`)
          .set('content-type', 'application/json')
          .end((err, res) => {
            expect(res).to.have.status(500);
            done();
          });
      });
    });

    // @todo: Fix this as it times out!
    // describe('Invalid resource', function () {
    //   it('should return a 400 for invalid resource', function (done) {
    //     agent.get(`${apiRoute}/invalid`)
    //       .set('content-type', 'application/json')
    //       .end((err, res) => {
    //         expect(res).to.have.status(400);
    //         expect(res.body).to.have.property('msg', 'API Error: Invalid resource');
    //         common.done(done)(err, res);
    //       });
    //   });
    // });

    // @todo: get these working: issue is that DB response stubbing is not working due to not injecting stubs into when using chaiHttp.
    describe.skip('Wishlists resource', function () {
        it('should return all collections', (done) => {
            const resolve = { data: [ { foo: 'bar' }, { baz: 'qux' } ] };
            stubs.DB.retrieveDocuments.returns(common.promise(resolve));
            setUp();

            agent.get(`${apiRoute}/wishlists`)
                .end((err, res) => {
                    console.log('wishlists', err, res);
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('Array');
                    common.done(done)(err, res);
                });
        });

        it('should return a valid collection', function (done) {
            const resolve = { data: { foo: 'bar' } };
            stubs.DB.retrieveDocuments.returns(common.promise(resolve));
            setUp();

            agent.get(`${apiRoute}/wishlists/568886aca24a049b66197bd7`)
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

            agent.get(`${apiRoute}/wishlists/invalid`)
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

            agent.post(`${apiRoute}/wishlists`)
                .send({ item: { name: 'foo' } })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.have.header('location', `${apiRoute}/wishlists/foo//`);
                    common.done(done)(err, res);
                });
        });

        it('should return collections', (done) => {
            const resolve = { data: [{ foo: 'bar' }, { baz: 'qux' }] };
            stubs.DB.retrieveCollections.returns(common.promise(resolve));
            setUp();

            agent.get(`${apiRoute}/wishlists`)
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
