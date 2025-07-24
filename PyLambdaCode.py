import json
import boto3
import os
import uuid
from datetime import datetime

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('TABLE_NAME', 'PortfolioContactMessages') # Get table name from environment variable
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        # Parse the incoming request body
        # API Gateway sends the body as a string, so we need to parse it
        if 'body' in event:
            body = json.loads(event['body'])
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*', # Required for CORS
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': 'Missing request body'})
            }

        # Extract form data
        name = body.get('name')
        email = body.get('email')
        message = body.get('message')

        # Basic validation
        if not name or not email or not message:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': 'Name, Email, and Message are required fields.'})
            }

        # Generate a unique message ID and timestamp
        message_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()

        # Prepare item for DynamoDB
        item = {
            'MessageId': message_id,
            'Name': name,
            'Email': email,
            'Message': message,
            'Timestamp': timestamp
        }

        # Store item in DynamoDB
        table.put_item(Item=item)

        # Log for debugging
        print(f"Successfully stored message: {message_id}")

        # Return a success response
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*', # Required for CORS
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Message sent successfully!'})
        }

    except Exception as e:
        # Log the error
        print(f"Error processing contact form: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*', # Required for CORS
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Internal server error.'})
        }
