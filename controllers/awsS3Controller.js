const { requestListObjects, getObjectsFromList } = require('../utils/aws');


exports.getLogsFromS3 = async function (req, res) {
    const { userId, method, path, startDate, endDate } = req.query;
    let sqlExpression = 'SELECT * FROM s3object s ';
    let whereString = 'WHERE ';
    let whereParams = [];
    if (userId) {
        whereParams.push(`userId='${userId}'`);
    }
    if (method) {
        whereParams.push(`method='${method}'`);
    }
    if (path) {
        whereParams.push(`path='${path}'`);
    }
    sqlExpression = sqlExpression + ((whereParams.length > 0) ? whereString + whereParams.join(' AND ') : "");

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

    await (async function () {
        const allObjectsListAux =[]
        try {
           await ( async function () {prefixArray.map(async (item) => {
                let objList;
                objList = await requestListObjects(item);
                allObjectsListAux.push(...objList);
            });
        })();
            console.log(allObjectsListAux);
        } catch (error) {
            console.log(error);
        }

    })();

    // const objectList = await requestListObjects("logs/book");
    // const sqlExpression = 'SELECT s3.* FROM S3Object AS s3';
    // await getObjectsFromList(objectList,sqlExpression);

    // try {
    //     await getObjectsFromList(allObjectsList, sqlExpression);
    // } catch (error) {
    //     console.log(error);
    // }

    const body = {
        sqlExpression,
        prefixArray,
    }
    res.status(200).send(body);
}