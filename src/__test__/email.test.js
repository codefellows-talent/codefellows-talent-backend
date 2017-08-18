/* global beforeAll, afterAll */

import sinon from 'sinon';
import AWS from 'aws-sdk-mock';
import AWS_SDK from 'aws-sdk';
import { sendConnectionEmail, sendClientEmail } from '../lib/email.js';



describe.skip('email functions', () => {

  let sendEmail;
  beforeAll(() => {
    sendEmail = sinon.spy();
    AWS.setSDKInstance(AWS_SDK);
    AWS.mock('SES', 'sendEmail', sendEmail);
  });

  afterAll(AWS.restore);

  const testProfile = {
    nickname: 'test',
    email: 'test@test.com',
    salesforceId: 'testid00000',
  };

  test('should send client an email', () => {
    //sendConnectionEmail([testProfile], { email: 'foo@bar.com', name: 'Foo', company: 'Bar Inc'});
    return sendClientEmail({ email: 'foo@bar.com', name: 'Foo', company: 'Bar Inc'})
      .then(() => expect(sendEmail.calledOnce).toEqual(true))
      .then(() => expect(sendEmail.lastCall.calledWith(sinon.match({
        Source: process.env.EMAIL_SOURCE,
        Destination: 'foo@bar.com',
        Message: {
          Subject: {
            Data: 'Your request to connect with Code Fellows graduates was received',
          },
          Body: {
            Html: {
              Data: sinon.match.any,
            },
          },
        },
      }))));
  });
});
