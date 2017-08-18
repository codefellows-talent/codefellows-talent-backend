/* global beforeAll, afterAll */
import superagent from 'superagent';
import AWS from 'aws-sdk-mock';
import server from '../lib/server';

describe('connect route', () => {

  beforeAll(() => {
    const mockSendEmail = (data, callback) => callback(null, 'lol');
    AWS.mock('SES', 'sendEmail', mockSendEmail);
    return server.start();
  });

  afterAll(() => {
    AWS.restore();
    return server.stop();
  });

  test('should connect', () => {
    return superagent.post(`http://localhost:${process.env.PORT}${process.env.API_URI}/connect`)
      .send({
        ids: ['00361000016XoIV'],
        email: 'therjfelix@gmail.com',
        company: 'Ferrety',
        name: 'Yancy Yartle',
      })
      .then(res => expect(res.status).toEqual(200));
  });

});
