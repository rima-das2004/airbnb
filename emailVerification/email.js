var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure:true,
  port:465,
  host:"smtp@gmail.com",
  auth: {
    user: 'contacturbanharvestofficially@gmail.com',
    pass: 'vidm vhmk mhhb jgec'
  }
});

var mailOptions = {
  from:'"Sending love" <contacturbanharvestofficially@gmail.com>',
  to: 'sanjitaray62@gmail.com',
  subject: 'just for fun',
  html:'<h1>Hi sanju</h1><p>Do you remember me?</p>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});