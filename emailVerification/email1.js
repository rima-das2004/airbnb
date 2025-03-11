const otp_verify = require("otp-verify");

otp_verify.setupSenderEmail({
  service: "gmail",
  user: 'contacturbanharvestofficially@gmail.com',
  pass: 'vidm vhmk mhhb jgec'
});

otp_verify.sendOTP(
  {
    to: "sanjitaray62@gmail.com",
    message: "Enter the below OTP for email validation",
    subject: "Email Verification",
  },
  (err, otp) => {
    if (err) console.log(err);
    else console.log("Email sent", otp);
  }
);