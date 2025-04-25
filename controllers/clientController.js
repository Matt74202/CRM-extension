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
exports.getClientSummary = async (req, res) => {
    try {
        // Récupérer tous les clients depuis l'API Spring
        const customersResponse = await axios.get('http://localhost:8080/api/rest/customer');
        const customers = customersResponse.data;

        // Préparer un tableau avec les données des clients et leurs sommes
        const clientSummaries = await Promise.all(
            customers.map(async (customer) => {
                const customerId = customer.customerId;

                // Appels parallèles pour obtenir les sommes par client
                const [budgetSum, ticketSum, leadSum] = await Promise.all([
                    axios.get(`http://localhost:8080/api/rest/budget/sum/customer/${customerId}`)
                        .catch(() => ({ data: 0 })), // Retourne 0 si erreur
                    axios.get(`http://localhost:8080/api/rest/ticket/sum/customer/${customerId}`)
                        .catch(() => ({ data: 0 })),
                    axios.get(`http://localhost:8080/api/rest/lead/sum/customer/${customerId}`)
                        .catch(() => ({ data: 0 }))
                ]);

                return {
                    customerId: customerId,
                    name: customer.name,
                    budgetSum: budgetSum.data,
                    ticketSum: ticketSum.data,
                    leadSum: leadSum.data
                };
            })
        );

        // Rendre la vue EJS avec les données
        res.render('client-summary', {
            clientSummaries: clientSummaries
        });

    } catch (error) {
        console.error('Erreur lors de la récupération du résumé des clients :', error);
        res.status(500).send('Erreur lors de la récupération des données des clients');
    }
};

module.exports = exports;