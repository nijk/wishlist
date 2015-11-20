/**
 * wishlist - core/__tests__/actions-test.js
 *
 * Created by nijk on 18/11/2015.
 */

'use strict';

jest.dontMock('../actions.js');

const actions = require('../actions.js');

describe('appStart', () => {
    it('calls API.fetchCSRFToken', () => {
        actions.appStart();

        expect(API.fetchCSRFToken).toBeCalled();
    });
});

