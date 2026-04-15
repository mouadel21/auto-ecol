require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Nodemailer Transporter Setup
// Gmail requires App Passwords if 2FA is enabled.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Post Contact Route
app.post('/contact', async (req, res) => {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !message) {
        return res.status(400).json({ error: 'Veuillez remplir au moins le nom, le téléphone et le message.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // The Auto Ecole's email address
        subject: `Demande de renseignement - Auto École Anouar (${name})`,
        text: `Nouvelle demande reçue depuis le site web Auto École Anouar :\n\nNom: ${name}\nTéléphone: ${phone}\nEmail: ${email || 'Non fourni'}\n\nMessage:\n${message}`,
        replyTo: email || undefined
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email envoyé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        res.status(500).json({ error: 'Erreur serveur interne. Impossible d\'envoyer le message.' });
    }
});

// Optional Dashboard/Health Route
app.get('/', (req, res) => {
    res.send('Auto École Backend Backend API is Running!');
});

// Start the server
app.listen(port, () => {
    console.log(`✅ Serveur Auto École démarré sur http://localhost:${port}`);
});
