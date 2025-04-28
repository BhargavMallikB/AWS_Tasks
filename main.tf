provider "aws" {
  region = "us-east-1"
}

# S3 Bucket
resource "aws_s3_bucket" "user_data_bucket" {
  bucket_prefix = "user-data-"
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "user_data_bucket" {
  bucket = aws_s3_bucket.user_data_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# DynamoDB Table
resource "aws_dynamodb_table" "user_table" {
  name           = "UserTable"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "N"
  }
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan"
        ]
        Resource = aws_dynamodb_table.user_table.arn
      }
    ]
  })
}

# AppSync GraphQL API
resource "aws_appsync_graphql_api" "user_api" {
  name                = "user-api"
  authentication_type = "API_KEY"

  schema = file("${path.module}/schema.graphql")
}

resource "aws_appsync_api_key" "api_key" {
  api_id = aws_appsync_graphql_api.user_api.id
}

# IAM Role for AppSync to invoke Lambda
resource "aws_iam_role" "appsync_lambda_role" {
  name = "appsync_lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "appsync.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "appsync_lambda_policy" {
  name = "appsync_lambda_policy"
  role = aws_iam_role.appsync_lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = "lambda:InvokeFunction"
      Resource = aws_lambda_function.crud_lambda.arn
    }]
  })
}

# Lambda Function for CRUD Operations
resource "aws_lambda_function" "crud_lambda" {
  filename         = "${path.module}/lambda-crud.zip"
  function_name    = "UserCrudLambda"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = filebase64sha256("${path.module}/lambda-crud.zip")

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.user_table.name
    }
  }
}

# AppSync Data Source (Lambda)
resource "aws_appsync_datasource" "lambda_datasource" {
  api_id           = aws_appsync_graphql_api.user_api.id
  name             = "LambdaDataSource"
  type             = "AWS_LAMBDA"
  lambda_config {
    function_arn = aws_lambda_function.crud_lambda.arn
  }
  service_role_arn = aws_iam_role.appsync_lambda_role.arn
}

# AppSync Resolvers
resource "aws_appsync_resolver" "create_user" {
  api_id      = aws_appsync_graphql_api.user_api.id
  type        = "Mutation"
  field       = "createUser"
  data_source = aws_appsync_datasource.lambda_datasource.name

  request_template = <<EOF
{
  "version": "2018-05-29",
  "operation": "Invoke",
  "payload": {
    "operation": "create",
    "user": $util.toJson($ctx.args.input)
  }
}
EOF

  response_template = "$util.toJson($ctx.result)"
}

resource "aws_appsync_resolver" "get_user" {
  api_id      = aws_appsync_graphql_api.user_api.id
  type        = "Query"
  field       = "getUser"
  data_source = aws_appsync_datasource.lambda_datasource.name

  request_template = <<EOF
{
  "version": "2018-05-29",
  "operation": "Invoke",
  "payload": {
    "operation": "read",
    "user": {
      "id": $ctx.args.id
    }
  }
}
EOF

  response_template = "$util.toJson($ctx.result)"
}

resource "aws_appsync_resolver" "list_users" {
  api_id      = aws_appsync_graphql_api.user_api.id
  type        = "Query"
  field       = "listUsers"
  data_source = aws_appsync_datasource.lambda_datasource.name

  request_template = <<EOF
{
  "version": "2018-05-29",
  "operation": "Invoke",
  "payload": {
    "operation": "list"
  }
}
EOF

  response_template = "$util.toJson($ctx.result)"
}

resource "aws_appsync_resolver" "update_user" {
  api_id      = aws_appsync_graphql_api.user_api.id
  type        = "Mutation"
  field       = "updateUser"
  data_source = aws_appsync_datasource.lambda_datasource.name

  request_template = <<EOF
{
  "version": "2018-05-29",
  "operation": "Invoke",
  "payload": {
    "operation": "update",
    "user": $util.toJson($ctx.args.input)
  }
}
EOF

  response_template = "$util.toJson($ctx.result)"
}

resource "aws_appsync_resolver" "delete_user" {
  api_id      = aws_appsync_graphql_api.user_api.id
  type        = "Mutation"
  field       = "deleteUser"
  data_source = aws_appsync_datasource.lambda_datasource.name

  request_template = <<EOF
{
  "version": "2018-05-29",
  "operation": "Invoke",
  "payload": {
    "operation": "delete",
    "user": {
      "id": $ctx.args.id
    }
  }
}
EOF

  response_template = "$util.toJson($ctx.result)"
}

# Outputs
output "graphql_api_url" {
  value = aws_appsync_graphql_api.user_api.uris["GRAPHQL"]
}

output "graphql_api_key" {
  value     = aws_appsync_api_key.api_key.key
  sensitive = true
}

output "user_table_name" {
  value = aws_dynamodb_table.user_table.name
}

output "s3_bucket_name" {
  value = aws_s3_bucket.user_data_bucket.bucket
}