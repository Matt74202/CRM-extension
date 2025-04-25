// controllers/leadController.js
const axios = require('axios');

exports.getLeadSummary = async (req, res) => {
    try {
        const leadsResponse = await axios.get('http://localhost:8080/api/rest/lead');
        const leads = leadsResponse.data;

        const leadSummaries = await Promise.all(
            leads.map(async (lead) => {
                const leadId = lead.leadId;
                const expenseResponse = await axios.get(`http://localhost:8080/api/rest/lead/${leadId}/expense`)
                    .catch(() => ({ data: { amount: 0 } })); 

                return {
                    leadId: lead.leadId,
                    managerUsername: lead.manager ? lead.manager.username : 'N/A', 
                    customerName: lead.customer ? lead.customer.name : 'N/A', 
                    amount: expenseResponse.data.amount || 0 
                };
            })
        );

        res.render('lead-summary', {
            leadSummaries: leadSummaries,
            title: 'Résumé des Leads'
        });

    } catch (error) {
        console.error('Error fetching lead summary:', error);
        res.status(500).render('error', {
            message: 'Erreur lors de la récupération des données des leads',
            error: error.message
        });
    }
};

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

exports.getLeadsByCustomer = async (req, res) => {
    const customerId = req.params.customerId;
    try {
        const leads = await axios.get(`http://localhost:8080/api/rest/lead/customer/${customerId}`);
        res.json(leads.data);
    } catch (error) {
        res.status(500).send('Error fetching leads');
    }
};

exports.updateLeadAmount = async (req, res) => {
    const leadId = req.params.leadId;
    const { amount, managerUsername, customerName } = req.body;
    console.log('Valeur brute de amount:', amount); // Log avant conversion
    console.log('Type de amount:', typeof amount);

    const formattedAmount = Number(amount).toFixed(2);
    console.log('Amount formaté:', formattedAmount);
    const url = `http://localhost:8080/api/rest/lead/update/${leadId}/${formattedAmount}`;
    console.log('URL envoyée:', url);

    try {
        const expense = await axios.post(`http://localhost:8080/api/rest/lead/update/${leadId}/${amount}`);
        res.redirect('/lead/lead-summary'); 
    } catch (error) {
        res.render('update-lead', {
            leadId,
            leadAmount: amount,
            managerUsername,
            customerName,
            error: 'Erreur lors de la mise à jour du lead'
        });
    }
};

exports.getEditLeadPage = async (req, res) => {
    const leadId = req.params.leadId;
    console.log(leadId)
    try {
        const leadResponse = await axios.get(`http://localhost:8080/api/rest/lead/${leadId}/expense`);
        const expense = leadResponse.data;
        
        res.render('update-lead', {
            leadId: leadId,
            leadAmount: expense.amount,
            error: null
        });
    } catch (error) {
        res.render('update-lead', {
            leadId: leadId,
            leadAmount: '',
            error: 'Erreur lors du chargement du lead'
        });
    }
};

exports.deleteLead = async (req, res) => {
    const leadId = req.params.leadId;
    try {
        await axios.get(`http://localhost:8080/api/rest/lead/delete/${leadId}`);
        res.redirect('/lead/lead-summary');
    } catch (error) {
        res.status(500).send('Error deleting lead');
    }
};