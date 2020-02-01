const nodemailer = require('nodemailer');

export const sendEmail = (message, { host, port, user, pass }) => {
  let transport = nodemailer.createTransport({
    host,
    port,
    secureConnection: true,
    secure: true,
    auth: {
      user,
      pass,
    },
  });

  return new Promise((resolve, reject) => {
    transport.sendMail(message, function(err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};
