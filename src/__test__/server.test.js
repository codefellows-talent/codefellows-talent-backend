import server from '../lib/server.js';

describe('server', () => {

  test('should start', () => {
    return server.start()
      .catch(err => expect(err).toNotExist());
  });

  test('should throw when starting again', () => {
    return expect(server.start()).rejects.toBeDefined();
  });

  test('should stop', () => {
    return server.stop()
      .catch(err => expect(err).toNotExist());
  });

  test('should throw when stopping again', () => {
    return expect(server.stop()).rejects.toBeDefined();
  });

});
