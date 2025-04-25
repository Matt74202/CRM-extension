const axios = require('axios');

exports.getDashboardPage = (req, res) => {
    res.render('detailTicket', { error: null });
};

exports.getdetailTicket = async (req, res) => {
    try {
        // Récupérer tous les tickets depuis l'API
        const ticketResponse = await axios.get('http://localhost:8080/api/rest/ticket');
        const tickets = ticketResponse.data;

        // Préparer un tableau avec les données des tickets et leurs montants
        const ticketSummaries = await Promise.all(
            tickets.map(async (ticket) => {
                const ticketId = ticket.ticketId;

                // Appels API parallèles pour récupérer les données associées au ticket
                const [ticketDetails, amount] = await Promise.all([
                    axios.get(`http://localhost:8080/api/rest/ticket/${ticketId}`)
                        .catch(() => ({ data: {} })), // Retourne un objet vide en cas d'erreur
                    axios.get(`http://localhost:8080/api/rest/ticket/${ticketId}/expense`)
                        .catch(() => ({ data: 0 })) // Retourne 0 en cas d'erreur
                ]);
                console.log(ticketDetails.data);
                console.log(amount);
                return {
                    ticketId: ticketId,
                    details: ticketDetails.data,
                    amount: amount.data
                };
            })
        );
       
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


        // Rendu de la page avec les tickets récupérés
        res.render('detailTicket', {
            tickets: ticketSummaries
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des tickets:', error);
        res.status(500).send('Erreur serveur');
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
    const { ticketId, amount } = req.params;
    try {
        const expense = await axios.post(`http://localhost:8080/api/rest/ticket/update/${ticketId}/${amount}`);
        res.json(expense.data);
    } catch (error) {
        res.status(500).send('Error updating ticket');
    }
};

exports.deleteTicket = async (req, res) => {
    const ticketId = req.params.ticketId;
    try {
        await axios.get(`http://localhost:8080/api/rest/ticket/delete/${ticketId}`);
        res.send(`Ticket with ID ${ticketId} deleted successfully`);
    } catch (error) {
        res.status(500).send('Error deleting ticket');
    }
};
