/* global beforeAll, afterAll */
import superagent from 'superagent';

import server from '../lib/server';

describe('profile route', () => {
  beforeAll(server.start);

  test('should respond 200 with some profiles', () => {
    return superagent.get(`http://localhost:${process.env.PORT}${process.env.API_URI}/profiles`)
      .then(res => {
        expect(res.status).toBe(200);
        return res.body;
      })
      .then(profiles => {
        expect(profiles).toHaveLength(10);
        const p = profiles[0];
        expect(p).toHaveProperty('nickname');
        expect(p).toHaveProperty('tagline');
        expect(p).toHaveProperty('careerTagline');
        expect(p).toHaveProperty('coursework');
        expect(p).toHaveProperty('location');
        expect(p).toHaveProperty('graduationDate');
        expect(p).toHaveProperty('employmentTypes');
        expect(p).toHaveProperty('skills');
        expect(p).toHaveProperty('tools');
        expect(p).toHaveProperty('roles');
        expect(p).toHaveProperty('salesforceId');
        expect(p).not.toHaveProperty('email');
      });
  });

  test('should respond 200 with a page of profiles of given length', () => {
    return superagent.get(`http://localhost:${process.env.PORT}${process.env.API_URI}/profiles?page=2&length=3`)
      .then(res => {
        expect(res.status).toBe(200);
        return res.body;
      })
      .then(profiles => {
        expect(profiles).toHaveLength(3);
      });
  });

  test('should respond 200 with a shuffleToken and some profiles', () => {
    return superagent.get(`http://localhost:${process.env.PORT}${process.env.API_URI}/profiles?shuffle=true`)
      .then(res => {
        expect(res.status).toBe(200);
        return res.body;
      })
      .then(body => {
        expect(body).toHaveProperty('shuffleToken');
        expect(body).toHaveProperty('profiles');
      });
  });

  afterAll(server.stop);
});
