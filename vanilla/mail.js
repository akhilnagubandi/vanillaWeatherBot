var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rka.nagubandi@gmail.com',
    pass: 'ramakrishna'
  }
});
var mailOptions = {
  from: 'rka.nagubandi@gmail.com',
  to: 'sachin.vadlakonda@eaiesb.com',
  subject: 'Sending Email using Node.js',
  text: 'hi sachin! welcome to node js'
};
transporter.sendMail(mailOptions, function(error, info){
if (error) {
  console.log(error);
} else {
  console.log('Email sent: ' + info.response);
}
});
