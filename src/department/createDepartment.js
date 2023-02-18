import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const makeResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
};

export const handler = async (event) => {
  let response;
  const { name, category } = JSON.parse(event.body);
  if (!name || !category) {
    response = makeResponse(400, {
      message: "Missing attributes! please verify again",
    });
    return response;
  }
  const ddbClient = new DynamoDBClient();
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: "DEP",
      SK: `DEP#${name}`,
      name: name,
      category: category,
      nbrEmployee: 0,
    },
  };
  try {
    const data = await ddbClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
    response = makeResponse(201, {
      name: params.Item.name,
      category: params.Item.category,
      nbrEmployee: params.Item.nbrEmployee,
    });
  } catch (err) {
    console.log("Error", err.stack);
    response = makeResponse(500, {
      message: "Something went wrong when adding.",
      error: err.stack,
    });
  }

  return response;
};
