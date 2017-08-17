/* global beforeAll */

import sinon from 'sinon';
import AWS from 'aws-sdk-mock';
import AWS_SDK from 'aws-sdk';
import { sendConnectionEmail, sendClientEmail } from '../lib/email.js';

const sendEmail = sinon.spy();

describe.skip('email functions', () => {

  beforeAll('configure mock aws', () => {
    AWS.setSDKInstance(AWS_SDK);
    AWS.mock('SES', 'sendEmail', sendEmail);
  });

  const testProfile = {
    nickname: 'test',
    email: 'test@test.com',
    salesforceId: 'testid00000',
  };

  test('should send client an email', () => {
    sendConnectionEmail([testProfile], { email: 'foo@bar.com', name: 'Foo', company: 'Bar Inc'});
    sendClientEmail({ email: 'foo@bar.com', name: 'Foo', company: 'Bar Inc'});
    // expect(sendEmail.calledOnce).toEqual(true);
    // expect(sendEmail.lastCall.calledWith(sinon.match({
    //   Source: process.env.EMAIL_SOURCE,
    //   Destination: 'foo@bar.com',
    //   Message: {
    //     Subject: {
    //       Data: 'Your request to connect with Code Fellows graduates was received',
    //     },
    //     Body: {
    //       Html: {
    //         Data: sinon.match.any,
    //       },
    //     },
    //   },
    // })));
  });
});
