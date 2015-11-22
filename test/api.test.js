/**
 * wishlist - test/api.test.js
 *
 * Created by nijk on 21/11/2015.
 */

'use strict';

const expect = require('chai').expect;
const supertest = require('supertest');
const request = supertest('http://localhost:3001');

const endAsyncTest = (next) => ((err, res) => {
    if (err) console.warn('ASYNC Error: ', err);
    next(err, res);
});

describe('API', () => {
    describe('CSRF', () => {
        it('should return a token as a string', (done) => {
            request.get('/api/token')
                .expect(200)
                .expect((res) => {
                    expect(res.body.token).to.be.a('string');
                })
                .end(endAsyncTest(done));
        });
    });

    describe('Fetch Product from URL', () => {
        it('should accept a URI encoded param', (done) => {
            const url = encodeURIComponent('http://google.com');
            request.get(`/api/product/${url}`)
                .expect(200)
                .end(endAsyncTest(done));
        });
        it('should return an object containing Open Graph data', (done) => {
            const url = encodeURIComponent('http://www.soundcloud.com');
            request.get(`/api/product/${url}`)
                .expect(200)
                .end(endAsyncTest((err, res) => {
                    expect(res.body.data).to.have.deep.property('ogSiteName', 'SoundCloud');
                    done();
                }));
        });
    });
});
