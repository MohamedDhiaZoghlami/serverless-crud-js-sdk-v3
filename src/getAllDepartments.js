import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event) => {
  const ddbClient = new DynamoDBClient();
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": "COM",
    },
    ScanIndexForward: false,
  };
  let departments = [];
  try {
    const data = await ddbClient.send(new QueryCommand(params));
    departments = data.Items.map((item) => {
      console.log(item);
      return {
        name: item.name,
        category: item.category,
        nbrEmployee: item.nbrEmployee,
      };
    });
    console.log("Success", data.Items);
  } catch (err) {
    console.log("Error", err.stack);
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      departments,
    }),
  };

  return response;
};
