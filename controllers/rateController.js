// controllers/rateController.js
const axios = require('axios');

exports.getRatePage = async (req, res) => {
    try {
        const rateResponse = await axios.get('http://localhost:8080/api/rest/rate');
        const lastRate = rateResponse.data;
        console.log(lastRate)
        
        res.render('rate', {
            lastRate: lastRate ? lastRate.rate : null, // Assurez-vous que c'est bien .rate
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du dernier taux:', error.message);
        res.render('rate', {
            lastRate: null,
            error: 'Erreur lors de la récupération du dernier taux',
            success: null
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

exports.saveRate = async (req, res) => {
    const { rateValue } = req.body;
    console.log('Valeur brute de rateValue:', rateValue);

    if (!rateValue || isNaN(Number(rateValue))) {
        return res.render('rate', {
            lastRate: null,
            error: 'Veuillez entrer un taux valide',
            success: null
        });
    }

    const formattedRate = Number(rateValue).toFixed(2);
    console.log('Rate formaté:', formattedRate);

    try {
        await axios.post(`http://localhost:8080/api/rest/rate/${formattedRate}`);
        
        const rateResponse = await axios.get('http://localhost:8080/api/rest/rate');
        const lastRate = rateResponse.data;
        console.log('Nouveau dernier taux:', lastRate);

        res.render('rate', {
            lastRate: lastRate ? lastRate.rate : formattedRate, // Correction ici
            error: null,
            success: 'Taux enregistré avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du taux:', error.message);
        res.render('rate', {
            lastRate: null,
            error: 'Erreur lors de l\'enregistrement du taux',
            success: null
        });
    }
};