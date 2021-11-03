const fs = require("fs");
const readline = require('readline');
const util = require('util')
const { S3Client, PutObjectCommand, SelectObjectContentCommand, ListObjectsCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const fsPromises = fs.promises;
exports.unlinkFile = util.promisify(fs.unlink);

const client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.BUCKET_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  }
})

const readFileLineByLine = async (fileName) => {
  const tempFileName = './logs/temp.log'
  await fsPromises.writeFile(tempFileName,'')
  const fileStream = fs.createReadStream(fileName);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    await fsPromises.appendFile(tempFileName, JSON.stringify(JSON.parse(line).message));
    await fsPromises.appendFile(tempFileName,'\n');
  }
  return fsPromises.readFile(tempFileName);
}

exports.uploadFile = async (fileName) => {
  const fileOutput = await readFileLineByLine(fileName);
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: fileOutput,
  }
  const command = new PutObjectCommand(params)
  const data = await client.send(command)
}

exports.requestListObjects = async (month, day) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
  }
  const command = new ListObjectsCommand(params)
  const data = await client.send(command);
  const objectList = data.Contents.filter(item =>
    item.LastModified.getMonth() === month - 1
    && item.LastModified.getDate() === day
  );
  //console.log(objectList);
  return objectList;
}

const getObject = async (objectKey) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: objectKey
  }
  const command = new GetObjectCommand(params);
  const data = await client.send(command);
  await fsPromises.writeFile(objectKey, data.Body);
}

const selectObjectContentFromS3 = async (objectKey, sqlExpression) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: objectKey,
      Expression: sqlExpression,
      ExpressionType: "SQL",
      InputSerialization: {
        JSON: {
          Type: "LINES"
        }
      },
      OutputSerialization: {
        JSON: {
          RecordDelimiter: ','
        }
      },
    }
    const command = new SelectObjectContentCommand(params);
    const data = await client.send(command);
    
    const records = [];

    const events = data.Payload;
    for await (const event of events) {
      if (event.Records) {
        records.push(event.Records.Payload);
      } else if (event.Stats) {
        // handle Stats event
      } else if (event.Progress) {
        // handle Progress event
      } else if (event.Cont) {
        // handle Cont event
      } else if (event.End) {
        // handle End event
        // let planetString = Buffer.concat(records).toString('utf8').slice(0,-1);
        let planetString = Buffer.concat(records).toString('utf8');
        await fsPromises.writeFile(objectKey,planetString);
      }
    }
  } catch (error) {
    console.log(`Item ${objectKey} error:`, error);
  }
}

exports.getObjectsFromList = async (objectList, sqlExpression) => {
  // objectList.map((item) => {
  //   getObject(item.Key)
  // });

  const myPromiseList = objectList.map(async (item) => {
    return selectObjectContentFromS3(item.Key, sqlExpression)
  });

  const res = await Promise.allSettled(myPromiseList);
}
