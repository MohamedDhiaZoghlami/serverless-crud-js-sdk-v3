import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event) => {
  const { name } = event.pathParameters;
  const ddbClient = new DynamoDBClient();
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: "COM",
      SK: `COM#${name}`,
    },
  };
  let a;
  try {
    const data = await ddbClient.send(new DeleteCommand(params));
    console.log("Success - item deleted", data);
    a = data;
  } catch (err) {
    console.log("Error", err.stack);
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "item deleted",
      info: a,
    }),
  };

  return response;
};
