const session = require('express-session');

module.exports = {
    secret: process.env.SESSION_SECRET || 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Passer à `true` en production avec HTTPS
};
