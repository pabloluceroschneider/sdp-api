const request = require('supertest');

const app = require('../src/app');

describe('GET /', () => {
  it('Check /', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'Basic Features API'
      }, done);
  });
});

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'v1'
      }, done);
  });
});
