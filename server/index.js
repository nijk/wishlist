'use strict';

const app = require('express')();

// Configure the application
require('./config')(app);
require('./api')(app);

/* Start Server */
app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
});