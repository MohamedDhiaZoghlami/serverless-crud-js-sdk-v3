import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

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
  let department = {};
  try {
    const data = await ddbClient.send(new GetCommand(params));
    const { category, nbrEmployee } = data.Item;
    department = {
      name: name,
      category: category,
      nbrEmployee: nbrEmployee,
    };
    console.log("Success", data.Item);
  } catch (err) {
    console.log("Error", err.stack);
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      department,
    }),
  };

  return response;
};
