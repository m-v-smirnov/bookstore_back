const express = require("express");
const awsS3Controller = require("../controllers/awsS3Controller");
const awsS3Router = express.Router();

awsS3Router.get("/get-logs",awsS3Controller.getLogsFromS3);

module.exports = awsS3Router;