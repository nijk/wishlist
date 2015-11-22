/**
 * wishlist - /index.js
 *
 * Created by nijk on 21/11/2015.
 */

'use strict';

const app = require('express')();
const config = require('../server/config');
const api = require('../server/api');

// Configure the application
config(app);
api(app);

app.set('port', 3001);

/* Start Server */
app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
});
