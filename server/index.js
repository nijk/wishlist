'use strict';

const app = require('express')();
const config = require('./config');
const api = require('./api');

// Configure the application
config(app);
api(app);

/* Start Server */
app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
});