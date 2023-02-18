import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

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
      PK: "DEP",
      SK: `DEP#${name}`,
    },
  };
  let a;
  try {
    const data = await ddbClient.send(new DeleteCommand(params));
    console.log("Success - item deleted", data);
    response = makeResponse(200, {
      message: "Item deleted",
    });
  } catch (err) {
    console.log("Error", err.stack);
    response = makeResponse(500, {
      message: "Something went wrong when deleting!",
      error: err.stack,
    });
  }

  return response;
};
