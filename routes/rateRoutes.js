// routes/rateRoutes.js
const express = require('express');
const router = express.Router();
const  rateController = require('../controllers/rateController');
const isSessionValid  = require('../controllers/rateController');
const checkSession = async (req, res, next) => {
    const jsessionId = req.cookies?.JSESSIONID || req.headers['cookie']?.split('JSESSIONID=')[1];

    if (!jsessionId || !(await isSessionValid(jsessionId))) {
        return res.status(401).render('errorPage', { error: 'Session invalide. Veuillez vous connecter dans CRM.' });
    }

    next();
};
router.get('/rate',rateController.getRatePage ,checkSession);
router.post('/rate', rateController.saveRate, checkSession);

module.exports = router;