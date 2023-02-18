import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const makeResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
};

export const handler = async (event) => {
  let response;
  const ddbClient = new DynamoDBClient();
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": "DEP",
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
    response = makeResponse(200, {
      departments,
    });
  } catch (err) {
    console.log("Error", err.stack);
    response = makeResponse(500, {
      message: "Cant retrieve data",
      error: err.stack,
    });
  }

  return response;
};
