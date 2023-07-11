const express = require('express');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');

require('dotenv').config();


const port = 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

const staffEmail = process.env.EMAIL_USER;
const staffPassword = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com', // using zoho mail as I prefer it 
    port: 465, 
    secure: true, 
    auth: {
      user: staffEmail, // this is your email
      pass: staffPassword // I created an application password which I use
    }
  });


app.post('/contact', async (req, res) =>{ // post request
    const { email, name, message } = req.body;


  console.log(`Staff Email ${staffEmail} \n\n User email ${email}`)
    // now we deliver our email :)

    const mailer = { 
        from: staffEmail,
        to: email,
        subject: 'Email Received',
        text: 'Thank you for contacting us, a representative will be available shortly to assist you',
      }

    await transporter.sendMail(mailer, (error, info) => {
      if (error) {
        console.error('Error sending email to user:', error);
      } else {
        console.log('Email sent to user successfully:', info.response);
      }
    });

    // deliver the email to the staff email
    const supportMail = {
      from: staffEmail,
      to: staffEmail,
      replyTo: email, //  set reply to so when we reply it replies to the user and not the from email :)
      subject: 'New Request Received',
      text: `${name}\n\n${message}`,
    };

    await transporter.sendMail(supportMail, (error, info) => {
      if (error) {
        console.error('Error sending staff email:', error);
      } else {
        console.log('Staff email sent successfully:', info.response); // success message
      }
    });

    res.status(200).send('Successfully sent a email!'); // send a status and message
})


app.get('/', (req, res) => {
  res.render('index') // render the index.ejs
})


app.listen(port, () => {
    console.log(`http://localhost:${port}`) 
});