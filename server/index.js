'use strict';

const app = require('express')();
const configureApp = require('./config');

// Configure the application
configureApp(app);

/* Start Server */
app.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`);
});
