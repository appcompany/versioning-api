import { describe } from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('verifyMessage', () => {
  it('should succeed correctly', () => {
    return chai.request('http://localhost:8080')
      .post('/verify-message')
      .send({
        title: 'changed some changes and tested some features',
        message: '[change]> this is a change\n[feat]> this is a feature',
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.valid).to.equal(true);
        expect(res.body.title).to
          .equal('changed some changes and tested some features');
        expect(res.body.message).to
          .equal('[change]> this is a change\n[feat]> this is a feature');
      });
  });

  it('should fail with changelog tags in the title', () => {
    return chai.request('http://localhost:8080')
      .post('/verify-message')
      .send({ title: '[feat]> test title', message: '[feat]> test message' })
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body.valid).to.equal(false);
        expect(res.body.errors).to.have.length(1)
          .and.to.contain('title contains changelog tags');
        expect(res.body.title).to.equal('[feat]> test title');
        expect(res.body.message).to.equal('[feat]> test message');
      });
  });

  it('should fail when title is missing', () => {
    return chai.request('http://localhost:8080')
      .post('/verify-message')
      .send({ message: 'test message' })
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body.valid).to.equal(false);
        expect(res.body.errors).to.have.length(1).and.to
          .contain('missing title');
      });
  });

  it('should fail when message is missing', () => {
    return chai.request('http://localhost:8080')
      .post('/verify-message')
      .send({ title: 'this is the title' })
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body.valid).to.equal(false);
        expect(res.body.errors).to.have.length(1).and.to
          .contain('missing message body');
      });
  });
});
