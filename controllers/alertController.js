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

exports.getAlerts = (req, res) => {
    res.render('alerts', { alerts: [] });
};

exports.configureAlert = async (req, res) => {
    const { budgetThreshold } = req.body;
    try {
        await axios.post('https://existingapp.com/api/config-alert', { budgetThreshold });
        res.send('Alert configured');
    } catch (error) {
        res.status(500).send('Alert configuration failed');
    }
};
