const express = require('express');
const { login, getLoginPage,isSessionValid} = require('../controllers/authController');  // Correctly import 'login'
const checkSession = async (req, res, next) => {
    const jsessionId = req.cookies?.JSESSIONID || req.headers['cookie']?.split('JSESSIONID=')[1];

    if (!jsessionId || !(await isSessionValid(jsessionId))) {
        return res.status(401).render('errorPage', { error: 'Session invalide. Veuillez vous connecter dans CRM.' });
    }

    next();
};
const authRouter = express.Router();

// Correct the reference to 'login'
authRouter.post('/login', login);
authRouter.get('/login', getLoginPage);

module.exports = authRouter;
