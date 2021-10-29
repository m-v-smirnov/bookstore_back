var winston = require('winston');
require('winston-daily-rotate-file');

// winston.configure({
//   transports: [
//     new (winston.transports.File)({ filename: './logs/somefile.log' })
//   ]
// });

var transport = new winston.transports.DailyRotateFile({
  filename: './logs/bookstore_requests_log-%DATE%.log',
  frequency: '5m',
  datePattern: 'YYYY-MM-DD-HH-mm',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

transport.on('rotate', function (oldFilename, newFilename) {
  // do something fun
  console.log('@@@@@@@@@@@@@@@@@@@Hi from file rotate');
});

var logger = winston.createLogger({
  transports: [
    transport
  ]
});

exports.requestsDataLogger = async function (req, res, next) {

  logger.info(`${req.url}`);
  next();
}

