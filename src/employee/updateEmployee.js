import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

const makeResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
};

export const handler = async (event) => {
  let response;
  const { name } = event.pathParameters;
  console.log(name);
  const { job } = JSON.parse(event.body);
  console.log(job);
  const ddbClient = new DynamoDBClient();
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: "EMP",
      SK: `EMP#${name}`,
    },
    UpdateExpression: "set job = :newjob",
    ExpressionAttributeValues: {
      ":newjob": job,
    },
  };
  let a;
  try {
    const data = await ddbClient.send(new UpdateCommand(params));
    console.log("Success", data);
    response = makeResponse(200, {
      message: "Item Updated!",
    });
  } catch (err) {
    console.log("Error", err.stack);
    response = makeResponse(200, {
      message: "update item failed!",
      error: err.stack,
    });
  }

  return response;
};
