const express = require('express');
const { getClientSummary ,isSessionValid} = require('../controllers/clientController');
const router = express.Router();
const checkSession = async (req, res, next) => {
    const jsessionId = req.cookies?.JSESSIONID || req.headers['cookie']?.split('JSESSIONID=')[1];

    if (!jsessionId || !(await isSessionValid(jsessionId))) {
        return res.status(401).render('errorPage', { error: 'Session invalide. Veuillez vous connecter dans CRM.' });
    }

    next();
};

router.get('/client-summary', checkSession,getClientSummary);

module.exports = router;