const express = require('express');
const { getticketSummary, updateTicketAmount, getEditTicketPage, deleteTicket,isSessionValid } = require('../controllers/ticketController'); // Import the correct function
const authMiddleware = require('../middlewares/authMiddleware');
const checkSession = async (req, res, next) => {
    const jsessionId = req.cookies?.JSESSIONID || req.headers['cookie']?.split('JSESSIONID=')[1];

    if (!jsessionId || !(await isSessionValid(jsessionId))) {
        return res.status(401).render('errorPage', { error: 'Session invalide. Veuillez vous connecter dans CRM.' });
    }

    next();
};
const router = express.Router();

router.get('/ticket', checkSession,getticketSummary);
router.get('/edit/:ticketId', checkSession,getEditTicketPage);
router.post('/edit/:ticketId',checkSession,updateTicketAmount);
router.get('/delete/:ticketId', checkSession,deleteTicket)

module.exports = router;