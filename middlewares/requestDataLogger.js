

var winston = require('winston');
const {
  uploadFile,
  unlinkFile,
  requestListObjects,
  getObjectsFromList,
  readFileLineByLine } = require('../utils/aws');
require('winston-daily-rotate-file');

var transport = new winston.transports.DailyRotateFile({
  filename: './logs/bookstore_requests_log-%DATE%.log',
  frequency: '1m',
  datePattern: 'YYYY-MM-DD-HH-mm',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d'
});

transport.on('rotate', async function (oldFilename, newFilename) {
  try {
    console.log('here we rotate');
    await uploadFile(oldFilename);
    await unlinkFile(oldFilename);
  
  } catch (error) {
    console.log(error);
  }
});

var logger = winston.createLogger({
  transports: [
    transport
  ]
});

exports.requestsDataLogger = async function (req, res, next) {
  const oldEnd = res.end;
  res.end = function (chunk) {
    const log = {
      method: req.method,
      path: req.originUrl,
      status: res.statusCode,
      userId: req.userId || 'Unauthorized',
      ts: Date.now(),
    }
    const excludeList = ['/images', '/genres', '/get-rating'];

    if (!excludeList.reduce((result, current) =>
      result = result || log.path.includes(current), false)) {
      logger.info(log);
    }
    oldEnd.apply(res, arguments);
  };
  next();
}




// const result = []

// readline.on('line', (line) => result.push(line))

// await fsP.writeFile('filename-date-here.json', JSON.stringify(result));

// await AWS.uploadFile('filename-date-here.json')