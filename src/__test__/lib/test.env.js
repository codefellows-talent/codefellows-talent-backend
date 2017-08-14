process.env.PORT = 7777;
process.env.MONGODB_URI = (
  process.env.TRAVIS
    ? process.env.MONGODB_URI
    : 'mongodb://localhost/test-db'
);
