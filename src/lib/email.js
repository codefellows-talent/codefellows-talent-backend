import AWS from 'aws-sdk';

AWS.config.update({region: `${process.env.AWS_REGION}`});
const ses = new AWS.SES({ apiversion: '2010-12-01' });

const fromAddress = `${process.env.EMAIL_SOURCE}`;
const toAddress = `${process.env.EMAIL_TARGET}`;

const formatProfileForEmail = profile => (
  `${profile.nickname}, ${profile.email} (Salesforce ID# ${profile.salesforceId})`
);

const sendMail = (
  {
    to,
    subject,
    bodyText,
    bodyHtml,
  },
  callback
) => {
  if(!to) {
    if(callback) {
      return callback('No email destination provided.');
    }
    throw new Error('sendMail: no email destination provided.');
  }
  if(!Array.isArray(to))
    to = [to];
  const body = {};
  if(bodyText) {
    body.Text = {
      Data: bodyText,
    };
  } else if(bodyHtml) {
    body.Html = {
      Data: bodyHtml,
    };
  } else {
    if(callback) {
      return callback('No email body provided.');
    }
    throw new Error('sendMail: no email body provided.');
  }
  ses.sendEmail({
    Source: fromAddress,
    Destination: { ToAddresses: to },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: body,
    },
  }, (err, data) => {
    if(err) callback(err);
    callback(null, data);
  });
};

export const sendConnectionEmail = (profiles, clientEmail) => {
  const formattedProfiles = profiles.map(formatProfileForEmail);
  const bodyText = 'A new request to connect with the following profiles was received:\n\n'.concat(formattedProfiles.reduce((message, text) => message.concat(text).concat('\n'), ''))
    .concat(`\n\nFrom our hiring partner at ${clientEmail}.`);
  return new Promise((resolve, reject) =>
    sendMail({
      to: toAddress,
      subject: 'A hiring partner wants to connect!',
      bodyText,
    }, function(err, data) {
      if(err)
        reject(err);
      console.log(`Email send from ${fromAddress} to ${toAddress}`);
      console.log(data);
      resolve(data);
    })
  );
};

export const sendClientEmail = email => {
  const bodyText = 'Your request to connect with Code Fellows graduates was received. Thank you!';
  return new Promise((resolve, reject) =>
    sendMail({
      to: email,
      subject: 'Your request to connect with Code Fellows graduates was received',
      bodyText,
    }, function(err, data) {
      if(err)
        reject(err);
      console.log(`Email sent to hiring partner at ${email}`);
      resolve(data);
    })
  );
};
