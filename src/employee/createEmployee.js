import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const makeResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
};

export const handler = async (event) => {
  let response;
  const { name, department, job } = JSON.parse(event.body);
  if (!name || !department || !job) {
    response = makeResponse(400, {
      message: "Missing attributes! please verify again",
    });
    return response;
  }
  const ddbClient = new DynamoDBClient();
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: "EMP",
      SK: `EMP#${name}`,
      GSI1PK: `DEP#${department}`,
      name: name,
      department: department,
      job: job,
    },
  };
  const depParams = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: "DEP",
      SK: `DEP#${department}`,
    },
    UpdateExpression: "set #nbrEmployee = #nbrEmployee + :inc",
    ExpressionAttributeNames: {
      "#nbrEmployee": "nbrEmployee",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  };
  try {
    const data = await ddbClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
    const dep = await ddbClient.send(new UpdateCommand(depParams));
    console.log("Success Department updated", dep);
    response = makeResponse(201, {
      name: params.Item.name,
      department: params.Item.department,
      job: params.Item.job,
    });
  } catch (err) {
    console.log("Error", err.stack);
    response = makeResponse(500, {
      message: "Something went wrong when adding employee.",
      error: err.stack,
    });
  }

  return response;
};
