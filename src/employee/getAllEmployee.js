import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const makeResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
};

export const handler = async (event) => {
  let response;
  const ddbClient = new DynamoDBClient();
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": "EMP",
    },
    ScanIndexForward: false,
  };
  let employees = [];
  try {
    const data = await ddbClient.send(new QueryCommand(params));
    employees = data.Items.map((item) => {
      console.log(item);
      return {
        name: item.name,
        department: item.department,
        job: item.job,
      };
    });
    console.log("Success", data.Items);
    response = makeResponse(200, {
      employees,
    });
  } catch (err) {
    console.log("Error", err.stack);
    response = makeResponse(500, {
      message: "Cant retrieve data",
      error: err.stack,
    });
  }

  return response;
};
