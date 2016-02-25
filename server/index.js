'use strict';

const app = require('express')();

// Configure the application
require('./config')(app);

/* Start Server */
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});