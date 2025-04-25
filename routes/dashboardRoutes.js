const express = require('express');
const { getDashboard, isSessionValid } = require('../controllers/dashboardController'); // Import correct

const router = express.Router();

// Middleware pour vérifier la session
const checkSession = async (req, res, next) => {
    const jsessionId = req.cookies?.JSESSIONID || req.headers['cookie']?.split('JSESSIONID=')[1];

    if (!jsessionId || !(await isSessionValid(jsessionId))) {
        return res.status(401).render('errorPage', { error: 'Session invalide. Veuillez vous connecter dans CRM.' });
    }

    next();
};

// Appliquer `checkSession` avant d'afficher le dashboard
router.get('/dashboard', checkSession, getDashboard);

module.exports = router;
