import AWS from 'aws-sdk';

AWS.config.update({region: 'us-west-2'});
const ses = new AWS.SES({ apiversion: '2010-12-01' });

const fromAddress = 'cfhired@zoho.com';
const toAddress = 'therjfelix@gmail.com';

const formatProfileForEmail = profile => (
  `${profile.nickname}, ${profile.email} (Salesforce ID# ${profile.salesforceId})`
);

const sendConnectionEmail = profiles => {
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

export default sendConnectionEmail;
