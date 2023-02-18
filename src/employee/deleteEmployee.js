import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const makeResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
};

export const handler = async (event) => {
  let response;
  const { department, name } = event.pathParameters;
  const ddbClient = new DynamoDBClient();
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: "EMP",
      SK: `EMP#${name}`,
    },
  };
  const depParams = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: "DEP",
      SK: `DEP#${department}`,
    },
    UpdateExpression: "set #nbrEmployee = #nbrEmployee - :inc",
    ExpressionAttributeNames: {
      "#nbrEmployee": "nbrEmployee",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  };
  try {
    const data = await ddbClient.send(new DeleteCommand(params));
    console.log("Success - item deleted", data);
    const dep = await ddbClient.send(new UpdateCommand(depParams));
    console.log("Success Department updated", dep);
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
