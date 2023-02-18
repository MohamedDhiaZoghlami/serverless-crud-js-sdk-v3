import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

const makeResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
};

export const handler = async (event) => {
  let response;
  const { name } = event.pathParameters;
  const ddbClient = new DynamoDBClient();
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: "EMP",
      SK: `EMP#${name}`,
    },
  };
  let employee = {};
  try {
    const data = await ddbClient.send(new GetCommand(params));
    const { department, job } = data.Item;
    employee = {
      name: name,
      department: department,
      job: job,
    };
    console.log("Success", data.Item);
    response = makeResponse(200, {
      employee,
    });
  } catch (err) {
    console.log("Error", err.stack);
    response = makeResponse(500, {
      message: "cant get item",
      error: err.stack,
    });
  }

  return response;
};
