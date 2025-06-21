const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

const pendingSubmissions = {};

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve HTML file

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ldvkvarma@gmail.com',// your Gmail
    pass: 'sszs zrze nkwn cbmv',// use app-specific password if 2FA enabled
  },
});

app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;
  const id = Date.now(); // simple unique key

  pendingSubmissions[id] = { name, email, message };

  const confirmationLink = `http://localhost:${PORT}/confirm?id=${id}`;

  const mailOptions = {
    from: 'ldvkvarma@gmail.com',
    to: email,
    subject: 'Confirm Your Contact Form Submission',
    html: `<p>Hello ${name},</p><p>Please confirm your message by clicking the link below:</p>
           <a href="${confirmationLink}">Confirm Submission</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to send confirmation email');
    }
    res.send('Confirmation email sent! Please check your inbox.');
  });
});

app.get('/confirm', (req, res) => {
  const { id } = req.query;
  const entry = pendingSubmissions[id];

  if (!entry) {
    return res.send('Invalid or expired link.');
  }

  // Send details to your admin email
  const adminMailOptions = {
    from: entry.email,
    to: 'ldvkvarma@gmail.com', // Your receiving email
    subject: `New Contact Form Submission from ${entry.name}`,
    html: `<h3>User Details</h3>
           <p><strong>Name:</strong> ${entry.name}</p>
           <p><strong>Email:</strong> ${entry.email}</p>
           <p><strong>Message:</strong> ${entry.message}</p>`,
  };

  transporter.sendMail(adminMailOptions, (err, info) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to send data to admin.');
    }
    delete pendingSubmissions[id];
    res.send('Thank you! Your message has been confirmed and sent.');
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));