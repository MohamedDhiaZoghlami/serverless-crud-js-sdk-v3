import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event) => {
  const { name, category } = JSON.parse(event.body);
  const ddbClient = new DynamoDBClient();
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: "COM",
      SK: `COM#${name}`,
      name: name,
      category: category,
      nbrEmployee: 0,
    },
  };
  try {
    const data = await ddbClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
  } catch (err) {
    console.log("Error", err.stack);
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      name: params.Item.name,
      category: params.Item.category,
      nbrEmployee: params.Item.nbrEmployee,
    }),
  };

  return response;
};
