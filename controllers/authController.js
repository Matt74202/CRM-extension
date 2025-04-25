const axios = require('axios');

exports.getLoginPage = (req, res) => {
    res.render('login', { error: null });
};

exports.login = async (req, res) => {
    try {
        const { email } = req.body;
        const response = await axios.post('http://localhost:8080/api/rest/auth/login', { email });

        const user = response.data;

        if (user && user.roles && user.roles.some(role => role.name === 'ROLE_MANAGER')) {
            res.status(200).json(user); 
        } else {
            res.status(401).send('Email incorrect'); 
        }

    } catch (error) {
        res.status(401).send('Email incorrect');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};
