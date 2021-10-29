var winston = require('winston');
require('winston-daily-rotate-file');
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const client = new S3Client({ region: "eu-central-1" });


var transport = new winston.transports.DailyRotateFile({
  filename: './logs/bookstore_requests_log-%DATE%.log',
  frequency: '1m',
  datePattern: 'YYYY-MM-DD-HH-mm',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d'
});

transport.on('rotate', async function (oldFilename, newFilename) {
  // do something fun
  
  console.log('@@@@@@@@@@@@@@@@@@@Hi from file rotate');
 // fs.unlinkSync(oldFilename);
});

var logger = winston.createLogger({
  transports: [
    transport
  ]
});

exports.requestsDataLogger = async function (req, res, next) {

  const log = {
    method: req.method,
    path: req.url,
    status: res.statusCode,
    userId: req.headers.authorization || 'Unauthorized',
    ts: Date.now(),
  }
  logger.info(JSON.stringify(log));

  // logger.info(`URL : ${req.url}, auth : ${req.headers.authorization},`+
  // ` IP: ${req.ip}, ts: ${Date.now()} `);
  next();
}

