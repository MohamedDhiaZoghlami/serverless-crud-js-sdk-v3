import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event) => {
  const { name } = event.pathParameters;
  console.log(name);
  const { category } = JSON.parse(event.body);
  console.log(category);
  const ddbClient = new DynamoDBClient();
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: "COM",
      SK: `COM#${name}`,
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
    a = data;
  } catch (err) {
    console.log("Error", err.stack);
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "item updated",
      info: a,
    }),
  };

  return response;
};
