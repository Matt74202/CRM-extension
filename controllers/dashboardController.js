const axios = require('axios');

exports.getDashboardPage = (req, res) => {
    res.render('dashboard', { error: null });
};

exports.getDashboard = async (req, res) => {
    try {
        const [customers, tickets, leads, expenses] = await Promise.all([
            axios.get('http://localhost:8080/api/rest/customer'), 
            axios.get('http://localhost:8080/api/rest/ticket'),   
            axios.get('http://localhost:8080/api/rest/lead'),
            axios.get('http://localhost:8080/api/rest/expense')    
        ]);

        const [customerCount, ticketCount, leadCount] = await Promise.all([
            axios.get('http://localhost:8080/api/rest/customer/count'),
            axios.get('http://localhost:8080/api/rest/ticket/count'),   
            axios.get('http://localhost:8080/api/rest/lead/count')     
        ]);

        const [budgetSum, ticketSum, leadSum]= await Promise.all([
            axios.get('http://localhost:8080/api/rest/budget/sum'),
            axios.get('http://localhost:8080/api/rest/ticket/sum'),   
            axios.get('http://localhost:8080/api/rest/lead/sum')     
        ]);

        const[top3]= await Promise.all([
            axios.get('http://localhost:8080/api/rest/budget/customer/top3')     
        ]);

        //console.log("Top3", top3.data)

        const expenseCount = expenses.data.length;

        // Calcul des montants totaux pour les tickets et les leads
        const ticketPercentage = expenseCount > 0 ? (ticketCount.data / expenseCount) * 100 : 0;
        const leadPercentage = expenseCount > 0 ? (leadCount.data / expenseCount) * 100 : 0;

        const topCustomers = top3.data.map(entry => entry.customer.name);
        //console.log(topCustomers)
        const topBudgets = top3.data.map(entry => entry.totalBudget);
       // console.log(topBudgets)

        res.render('dashboard', {
            customers: customers.data,
            tickets: tickets.data,
            leads: leads.data,
            expenses: expenses.data,
            customerCount: customerCount.data,
            ticketCount: ticketCount.data,
            leadCount: leadCount.data,
            expenseCount: expenses.data.length,
            totalExpense: expenseCount,    
            ticketPercentage: ticketPercentage.toFixed(2),
            leadPercentage: leadPercentage.toFixed(2),
            budgetSum: budgetSum.data,
            ticketSum: ticketSum.data,
            leadSum: leadSum.data,
            topCustomers: JSON.stringify(topCustomers),
            topBudgets: JSON.stringify(topBudgets)
        });


    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
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


exports.getCustomerById = async (req, res) => {
    const customerId = req.params.id;
    try {
        const customer = await axios.get(`http://localhost:8080/api/rest/customer/${customerId}`);
        res.json(customer.data);
    } catch (error) {
        res.status(500).send('Error fetching customer data');
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
    const { leadId, amount } = req.params;
    try {
        const expense = await axios.post(`http://localhost:8080/api/rest/lead/update/${leadId}/${amount}`);
        res.json(expense.data);
    } catch (error) {
        res.status(500).send('Error updating lead');
    }
};

exports.deleteLead = async (req, res) => {
    const leadId = req.params.leadId;
    try {
        await axios.get(`http://localhost:8080/api/rest/lead/delete/${leadId}`);
        res.send(`Lead with ID ${leadId} deleted successfully`);
    } catch (error) {
        res.status(500).send('Error deleting lead');
    }
};

exports.sumLead = async (req, res) => {
    try {
        await axios.get(`http://localhost:8080/api/rest/lead/sum`);
        res.send(`Sum not found`);
    } catch (error) {
        res.status(500).send('Sum not found');
    }
};

exports.sumTicket = async (req, res) => {
    try {
        await axios.get(`http://localhost:8080/api/rest/ticket/sum`);
        res.send(`Sum not found`);
    } catch (error) {
        res.status(500).send('Sum not found');
    }
};

exports.sumBudget = async (req, res) => {
    try {
        await axios.get(`http://localhost:8080/api/rest/budget/sum`);
        res.send(`Sum not found`);
    } catch (error) {
        res.status(500).send('Sum not found');
    }
};
