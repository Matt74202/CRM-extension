require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const sessionConfig = require('./config/sessionConfig');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const alertRoutes = require('./routes/alertRoutes');
const clientRoutes = require('./routes/clientRoutes');
const leadRoutes = require('./routes/leadRoutes');
const rateRoutes = require('./routes/rateRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Ajoutez ceci
app.use(bodyParser.json());
app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/ticket', ticketRoutes);
app.use('/alert', alertRoutes);
app.use('/client', clientRoutes);
app.use('/lead', leadRoutes);
app.use('/rate', rateRoutes);

app.get('/', (req, res) => {
    res.render('index');
});
app.use('/dashboard', dashboardRoutes);


// Lancement du serveur
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
