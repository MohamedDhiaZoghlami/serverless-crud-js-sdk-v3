<!--
title: 'AWS NodeJS Example'
description: 'This template demonstrates how to deploy a NodeJS function running on AWS Lambda using the traditional Serverless Framework.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# Basic Crud operations using Serverless Framework

I have used nodejs, api gateway, lambda and dynamodb to make a simple crud of departments and ill be adding employees and the 'One to Many' relationship later on, for now it only has 'create department' , 'get department by name' , 'get all departments' , 'update department category' , 'delete department'

## Usage

### Deployment

In order to deploy the example, you need to run the following command:

```
$ serverless deploy
```

## Next steps

### Employee CRUD

I will add employee crud operations with updating the department each time i add or delete an employee

### ERD

I'll add the entity relationship diagram when i finish the whole project

### Access Patterns

Every DynamoDB need access patterns to be optimized so ill add that later on
