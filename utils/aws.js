const fs = require("fs");
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

exports.uploadFile = async (fileName) => {
  const fileContent = await fsPromises.readFile(fileName);
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
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
  await fsPromises.writeFile(objectKey,data.Body);
}

exports.getObjectsFromList = async (objectList) => {
  objectList.map((item) => {
    getObject(item.Key)
  });
}

