/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar app = __webpack_require__(1)();\nvar config = __webpack_require__(2);\nvar api = __webpack_require__(14);\n\n// Configure the application\nconfig(app);\napi(app);\n\n/* Start Server */\napp.listen(app.get('port'), function () {\n    console.log('Express server listening on port ' + app.get('port'));\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./server/index.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./server/index.js?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("module.exports = require(\"express\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"express\"\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22express%22?");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\n * wishlist - server/config\n *\n * Created by nijk on 10/11/2015.\n */\n\n'use strict';\n\nvar logger = __webpack_require__(3);\nvar bodyParser = __webpack_require__(4);\nvar methodOverride = __webpack_require__(5);\nvar cookieParser = __webpack_require__(6);\nvar session = __webpack_require__(7);\nvar errorHandler = __webpack_require__(9);\nvar helmet = __webpack_require__(10);\nvar passport = __webpack_require__(11);\nvar serveStatic = __webpack_require__(13);\n\nvar serveStaticOpts = {\n    'index': ['index.html']\n};\n\nmodule.exports = function (app) {\n    app.set('port', process.env.PORT || 3000);\n\n    app.use(bodyParser.json());\n\n    /* Helmet (security headers) */\n    app.use(helmet());\n    app.use(helmet.contentSecurityPolicy());\n\n    /* Express */\n    app.use(methodOverride());\n    app.use(cookieParser());\n    app.use(session({\n        secret: \"notagoodsecret\",\n        cookie: { httpOnly: true }\n    }));\n\n    /* Passport */\n    app.use(passport.initialize());\n    app.use(passport.session());\n\n    /* Static Assets */\n    app.use(serveStatic('dist', serveStaticOpts));\n\n    /* Error Handling: middleware should be loaded after the loading the routes */\n    if ('development' == app.get('env')) {\n        app.use(logger('dev'));\n        app.use(errorHandler());\n    }\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./server/config.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./server/config.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("module.exports = require(\"morgan\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"morgan\"\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22morgan%22?");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("module.exports = require(\"body-parser\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"body-parser\"\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ },
/* 5 */
/***/ function(module, exports) {

	eval("module.exports = require(\"method-override\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"method-override\"\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22method-override%22?");

/***/ },
/* 6 */
/***/ function(module, exports) {

	eval("module.exports = require(\"cookie-parser\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"cookie-parser\"\n ** module id = 6\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22cookie-parser%22?");

/***/ },
/* 7 */
/***/ function(module, exports) {

	eval("module.exports = require(\"express-session\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"express-session\"\n ** module id = 7\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22express-session%22?");

/***/ },
/* 8 */
/***/ function(module, exports) {

	eval("module.exports = require(\"csurf\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"csurf\"\n ** module id = 8\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22csurf%22?");

/***/ },
/* 9 */
/***/ function(module, exports) {

	eval("module.exports = require(\"errorhandler\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"errorhandler\"\n ** module id = 9\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22errorhandler%22?");

/***/ },
/* 10 */
/***/ function(module, exports) {

	eval("module.exports = require(\"helmet\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"helmet\"\n ** module id = 10\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22helmet%22?");

/***/ },
/* 11 */
/***/ function(module, exports) {

	eval("module.exports = require(\"passport\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"passport\"\n ** module id = 11\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22passport%22?");

/***/ },
/* 12 */,
/* 13 */
/***/ function(module, exports) {

	eval("module.exports = require(\"serve-static\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"serve-static\"\n ** module id = 13\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22serve-static%22?");

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\n * wishlist - server/api\n *\n * Created by nijk on 10/11/2015.\n */\n\n'use strict';\n\nvar auth = __webpack_require__(15);\nvar csrf = __webpack_require__(8)();\nvar routes = __webpack_require__(19);\nvar ineed = __webpack_require__(21);\n\nfunction errorHandler(req, res, msg) {\n\n    // @todo: log errors server-side\n\n    res.json({ error: msg });\n}\n\nfunction getUserObject(req, res, id) {\n    if (id) {\n        res.json({ username: id });\n    } else {\n        errorHandler(req, res, 'User not found');\n    }\n};\n\nmodule.exports = function (app) {\n    app.get(routes.token, csrf, function (req, res) {\n        res.json({ token: req.csrfToken() });\n    });\n\n    app.post(routes.productURL, function (req, res) {\n        // @todo: validate CSRF?\n\n        console.info('productURL', req.body);\n\n        ineed.collect.images.from(req.body.url, function (err, response, result) {\n            if (!err) {\n                // clearTimeout( timeOut );\n                console.log(result);\n                res.json(result);\n            } else {\n                errorHandler(req, res, 'error collecting resources');\n            }\n        });\n    });\n\n    /*app.get('/api/user/:id?', auth.authenticate('local'), function(req, res) {\n        res.json(getUserObject(req, res, req.params.id));\n    });\n     app.post('/api/login', auth.authenticate('local'), function(req, res) {\n        // If this function gets called, authentication was successful.\n        res.json(getUserObject(req, res, req.user.username));\n    });*/\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./server/api.js\n ** module id = 14\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./server/api.js?");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\n * wishlist - server/api\n *\n * Created by nijk on 10/11/2015.\n */\n\n'use strict';\n\nvar passport = __webpack_require__(11);\nvar LocalStrategy = __webpack_require__(16).Strategy;\nvar DB = __webpack_require__(17);\n//const Users = DB.connect( (db) => db.collection('users') );\n\npassport.serializeUser(function (user, done) {\n    done(null, user);\n});\n\npassport.deserializeUser(function (user, done) {\n    done(null, user);\n});\n\n// Passport setup\npassport.use(new LocalStrategy(function (username, password, done) {\n    DB.connect(function (err, db) {\n\n        var Users = db.collection('users');\n        Users.findOne({ username: username }, function (err, user) {\n            if (err) {\n                return done(err);\n            }\n            if (!user) {\n                return done(null, false, { message: 'Incorrect username.' });\n            }\n            if (password !== user.password) {\n                //@todo: don't evaluate passwords against unhashed data\n                return done(null, false, { message: 'Incorrect password.' });\n            }\n            return done(null, user);\n        });\n    });\n}));\n\nmodule.exports = passport;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./server/auth.js\n ** module id = 15\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./server/auth.js?");

/***/ },
/* 16 */
/***/ function(module, exports) {

	eval("module.exports = require(\"passport-local\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"passport-local\"\n ** module id = 16\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22passport-local%22?");

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\n * wishlist - server/db\n *\n * Created by nijk on 10/11/2015.\n */\n\n'use strict';\n\nvar MongoClient = __webpack_require__(18).MongoClient;\nvar MongoURL = 'mongodb://localhost:27017/wishlist';\n\nmodule.exports = {\n    connect: function connect(fn) {\n        // Connect using MongoClient\n        MongoClient.connect(MongoURL, function (err, db) {\n            fn(err, db);\n            if (err) {\n                console.info('DB error!', err);\n            }\n        });\n    }\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./server/db.js\n ** module id = 17\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./server/db.js?");

/***/ },
/* 18 */
/***/ function(module, exports) {

	eval("module.exports = require(\"mongodb\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"mongodb\"\n ** module id = 18\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22mongodb%22?");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _ = __webpack_require__(20);\n\nmodule.exports = {\n    token: '/api/token',\n    productURL: '/api/product/url',\n    user: '/api/user/',\n    login: '/api/login'\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./routes.api.js\n ** module id = 19\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./routes.api.js?");

/***/ },
/* 20 */
/***/ function(module, exports) {

	eval("module.exports = require(\"lodash\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"lodash\"\n ** module id = 20\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22lodash%22?");

/***/ },
/* 21 */
/***/ function(module, exports) {

	eval("module.exports = require(\"ineed\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"ineed\"\n ** module id = 21\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22ineed%22?");

/***/ }
/******/ ]);