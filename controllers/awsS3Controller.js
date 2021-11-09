const { requestListObjects, getObjectsFromList } = require('../utils/aws');

const makeSqlQueryString = (selectString, whereConditions) => {
  let whereParams = [];
  const whereString = ' WHERE ';

  for (let key in whereConditions) {
    if (whereConditions[key]) {
      whereParams.push(`s.${key}='${whereConditions[key]}'`);
    }
  }
  const result = selectString + ((whereParams.length > 0) ? whereString + whereParams.join(' AND ') : "");
  return result
}

exports.getLogsFromS3 = async function (req, res) {
  const { userId, method, path, startDate, endDate } = req.query;
  const sqlExpression = makeSqlQueryString("SELECT * FROM s3object s", { userId, method, path });
  startDateParsed = new Date(startDate);
  endDateParsed = new Date(endDate);

  const prefixArray = [];
  const startPrefix = 'logs/bookstore_requests_log-';
  for (let i = startDateParsed.getFullYear(); i <= endDateParsed.getFullYear(); i++) {
    for (let j = startDateParsed.getMonth(); j <= endDateParsed.getMonth(); j++) {
      for (let k = startDateParsed.getDate(); k <= endDateParsed.getDate(); k++) {
        prefixArray.push(startPrefix + (new Date(i, j, k + 1)).toISOString().slice(0, 10));
      }
    }
  }

  let allObjectsList = [];
  try {
    const myPromiseList = prefixArray.map(async (item) => {
      const objList = await requestListObjects(item);
      allObjectsList.push(...objList);
    });
    await Promise.allSettled(myPromiseList);
  } catch (error) {
    console.log(error);
  }

  let logsFromS3Array=[];
  let logsFromS3ArrayOutput=[];
  try {
   logsFromS3Array = await getObjectsFromList(allObjectsList, sqlExpression);
   console.log('log log log',logsFromS3Array);
  } catch (error) {
    console.log(error);
  }
  logsFromS3ArrayOutput = logsFromS3Array.reduce((resultString,current) => resultString + current.value,'[');
  const logsFromS3ArrayOutputParsed = JSON.parse(logsFromS3ArrayOutput.slice(0,-2) + "]");


  const body = {
    sqlExpression,
    prefixArray,
    logsFromS3ArrayOutputParsed,
  }
  res.status(200).send(body);
}
