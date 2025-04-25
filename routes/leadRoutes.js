// routes/leadRoutes.js
const express = require('express');
const router = express.Router();
const  leadController = require('../controllers/leadController');
const isSessionValid=require('../controllers/leadController')
const checkSession = async (req, res, next) => {
    const jsessionId = req.cookies?.JSESSIONID || req.headers['cookie']?.split('JSESSIONID=')[1];

    if (!jsessionId || !(await isSessionValid(jsessionId))) {
        return res.status(401).render('errorPage', { error: 'Session invalide. Veuillez vous connecter dans CRM.' });
    }

    next();
};
router.get('/lead-summary',leadController.getLeadSummary, checkSession);
router.get('/edit/:leadId',leadController.getEditLeadPage,checkSession );
router.post('/edit/:leadId',leadController.updateLeadAmount,checkSession );
router.get('/delete/:leadId', leadController.deleteLead,checkSession )

module.exports = router;