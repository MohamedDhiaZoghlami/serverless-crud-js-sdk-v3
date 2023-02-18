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
  const { category } = JSON.parse(event.body);
  console.log(category);
  const ddbClient = new DynamoDBClient();
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: "DEP",
      SK: `DEP#${name}`,
    },
    UpdateExpression: "set category = :newcategory",
    ExpressionAttributeValues: {
      ":newcategory": category,
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
