import AWS from 'aws-sdk';

AWS.config.update({region: `${process.env.AWS_REGION}`});
const ses = new AWS.SES({ apiversion: '2010-12-01' });

const fromAddress = `${process.env.EMAIL_SOURCE}`;
const toAddress = `${process.env.EMAIL_TARGET}`;

const formatProfileForEmail = profile => (
  `${profile.nickname}, ${profile.email} (Salesforce ID# ${profile.salesforceId})`
);

export const sendConnectionEmail = profiles => {
  const formattedProfiles = profiles.map(formatProfileForEmail);
  const bodyText = formattedProfiles.reduce((message, text) => message.concat(text).concat('\n'), '');
  return new Promise((resolve, reject) =>
    ses.sendEmail({
      Source: fromAddress,
      Destination: { ToAddresses: [toAddress] },
      Message: {
        Subject: {
          Data: 'A hiring partner wants to connect!',
        },
        Body: {
          Text: {
            Data: bodyText,
          },
        },
      },
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
  const bodyText = 'Your request to connect with Code Fellows graduates was approved. Thank you!';
  return new Promise((resolve, reject) =>
    ses.sendEmail({
      Source: fromAddress,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: {
          Data: 'Your request to connect with Code Fellows graduates was received',
        },
        Body: {
          Text: {
            Data: bodyText,
          },
        },
      },
    }, function(err, data) {
      if(err)
        reject(err);
      console.log(`Email sent to hiring partner at ${email}`);
      resolve(data);
    })
  );
};
