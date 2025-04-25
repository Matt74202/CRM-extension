const axios = require('axios');

exports.isSessionValid = async function (jsessionId) {
    if (!jsessionId) {
        return false;
    }
    try {
        const response = await axios.get('http://localhost:8080/api/checkRole', {
            params: { JSessionID: jsessionId },
            headers: { Cookie: `JSESSIONID=${jsessionId}` }
        });

        console.log("Réponse reçue:", response.data); // Debug : affiche le contenu exact de la réponse

        // Vérifie si response.data est un objet ou une chaîne
        const result = typeof response.data === 'string' 
            ? response.data.trim().toLowerCase() === 'true' 
            : response.data === true; // Si c'est un objet JSON, on vérifie directement

        return result;
    } catch (error) {
        console.error(`Error while verifying session: ${error.message}`);
        return false;
    }
};

exports.getDashboardPage = (req, res) => {
    res.render('detailTicket', { error: null });
};

exports.getticketSummary = async (req, res) => {
    try {
        const ticketsResponse = await axios.get('http://localhost:8080/api/rest/ticket');
        const tickets = ticketsResponse.data;

        const ticketSummaries = await Promise.all(
            tickets.map(async (ticket) => {
                const ticketId = ticket.ticketId;
                const expenseResponse = await axios.get(`http://localhost:8080/api/rest/ticket/${ticketId}/expense`)
                    .catch(() => ({ data: { amount: 0 } })); 

                return {
                    ticketId: ticket.ticketId,
                    managerUsername: ticket.manager ? ticket.manager.username : 'N/A', 
                    customerName: ticket.customer ? ticket.customer.name : 'N/A', 
                    amount: expenseResponse.data.amount || 0 
                };
            })
        );

        res.render('ticket-summary', {
            ticketSummaries: ticketSummaries,
            title: 'Résumé des tickets'
        });

    } catch (error) {
        console.error('Error fetching ticket summary:', error);
        res.status(500).render('error', {
            message: 'Erreur lors de la récupération des données des tickets',
            error: error.message
        });
    }
};

    


exports.getTicketsByCustomer = async (req, res) => {
    const customerId = req.params.customerId;
    try {
        const tickets = await axios.get(`http://localhost:8080/api/rest/ticket/customer/${customerId}`);
        res.json(tickets.data);
    } catch (error) {
        res.status(500).send('Error fetching tickets');
    }
};

exports.updateTicketAmount = async (req, res) => {
    const ticketId = req.params.ticketId;
    const { amount, managerUsername, customerName } = req.body;
    console.log('Valeur brute de amount:', amount); // Log avant conversion
    console.log('Type de amount:', typeof amount);

    const formattedAmount = Number(amount).toFixed(2);
    console.log('Amount formaté:', formattedAmount);
    const url = `http://localhost:8080/api/rest/ticket/update/${ticketId}/${formattedAmount}`;
    console.log('URL envoyée:', url);

    try {
        const expense = await axios.post(`http://localhost:8080/api/rest/ticket/update/${ticketId}/${amount}`);
        res.redirect('/ticket/ticket'); 
    } catch (error) {
        res.render('update-ticket', {
            ticketId,
            ticketAmount: amount,
            managerUsername,
            customerName,
            error: 'Erreur lors de la mise à jour du ticket'
        });
    }
};

exports.getEditTicketPage = async (req, res) => {
    const ticketId = req.params.ticketId;
    console.log(ticketId)
    try {
        const ticketResponse = await axios.get(`http://localhost:8080/api/rest/ticket/${ticketId}/expense`);
        const expense = ticketResponse.data;
        
        res.render('update-ticket', {
            ticketId: ticketId,
            ticketAmount: expense.amount,
            error: null
        });
    } catch (error) {
        res.render('update-ticket', {
            ticketId: ticketId,
            ticketAmount: '',
            error: 'Erreur lors du chargement du ticket'
        });
    }
};

exports.deleteTicket = async (req, res) => {
    const ticketId = req.params.ticketId;
    try {
        await axios.get(`http://localhost:8080/api/rest/ticket/delete/${ticketId}`);
        res.redirect('/ticket/ticket');
    } catch (error) {
        res.status(500).send('Error deleting ticket');
    }
};
