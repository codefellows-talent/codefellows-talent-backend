process.env.PORT = 3002;
process.env.MONGODB_URI = (
  process.env.TRAVIS
    ? process.env.MONGODB_URI
    : 'mongodb://localhost/test-db'
);
process.env.API_URI = '/api/v1';
process.env.AWS_ACCESS_KEY_ID='mock access key';
process.env.AWS_SECRET_ACCESS_KEY='mock secret key';
process.env.S3_CSV_URI='https://s3.amazonaws.com/401-hire-cf/sample.csv';
process.env.EMAIL_SOURCE='cfhired@zoho.com';
process.env.EMAIL_TARGET='therjfelix@gmail.com';
process.env.AWS_REGION='us-west-2';
process.env.EMAIL_RATE_LIMIT=10000;
process.env.CACHE_UPDATE_INTERVAL=120000;
