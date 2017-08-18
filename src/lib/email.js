import fs from 'fs';
import AWS from 'aws-sdk';
import Mustache from 'mustache';

AWS.config.update({region: `${process.env.AWS_REGION}`});
const ses = new AWS.SES({ apiversion: '2010-12-01' });

const fromAddress = `${process.env.EMAIL_SOURCE}`;
const toAddress = `${process.env.EMAIL_TARGET}`;

let template = null;

fs.readFile(`${__dirname}/../../static/email.mst`, 'utf8', (err, data) => {
  if(err) {
    console.error(err);
    console.log(`${__dirname}/../../static/email.mst`);
  }
  template = data;
  Mustache.parse(template);
});

const formatProfileForEmail = profile => (
  `${profile.nickname}, ${profile.email} (Salesforce link https://na34.salesforce.com/${profile.salesforceId})`
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

export const sendConnectionEmail = (profiles, { email, name, company }) => {
  const formattedProfiles = profiles.map(formatProfileForEmail);
  const bodyText = 'A new request to connect with the following profiles was received:\n\n'.concat(formattedProfiles.reduce((message, text) => message.concat(text).concat('\n'), ''))
    .concat(`\n\nFrom our hiring partner ${name} at ${company}, who can be contacted at ${email}.`);
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

export const sendClientEmail = ({ email, name, company }) => {
  //const bodyText = `${name}, your request to connect with Code Fellows graduates was received. Thank you and everyone at ${company}!`;
  return new Promise((resolve, reject) =>
    sendMail({
      to: email,
      subject: 'Your request to connect with Code Fellows graduates was received',
      bodyHtml: Mustache.render(template, { name, company }),
    }, function(err, data) {
      if(err)
        reject(err);
      console.log(`Email sent to hiring partner at ${email}`);
      resolve(data);
    })
  );
};
