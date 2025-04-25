const express = require('express');
const { getdetailTicket, isSessionValid } = require('../controllers/detailTicketController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkSession = async (req, res, next) => {
    const jsessionId = req.cookies?.JSESSIONID || req.headers['cookie']?.split('JSESSIONID=')[1];

    if (!jsessionId || !(await isSessionValid(jsessionId))) {
        return res.status(401).render('errorPage', { error: 'Session invalide. Veuillez vous connecter dans CRM.' });
    }

    next();
};
const router = express.Router();

//router.get('/dashboard', authMiddleware, getDashboardPage);
    router.get('/detailTicket',checkSession, getdetailTicket);

module.exports = router;