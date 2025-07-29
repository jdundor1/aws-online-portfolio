import json
import boto3
import os
import uuid
from datetime import datetime

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
ses = boto3.client('ses') # Initialize SES client

# Get table name from environment variable
table_name = os.environ.get('TABLE_NAME', 'PortfolioContactMessages')
table = dynamodb.Table(table_name)

# Configuration for SES email
# IMPORTANT: SENDER_EMAIL_ADDRESS MUST BE YOUR VERIFIED EMAIL IN SES
SENDER_EMAIL_ADDRESS = 'jdundor@wgu.edu' # REPLACE WITH YOUR VERIFIED EMAIL
RECIPIENT_EMAIL_ADDRESS = 'jdundor@wgu.edu' # REPLACE WITH YOUR VERIFIED EMAIL (where you want notifications)

def lambda_handler(event, context):
    try:
        print('Received event:', json.dumps(event))

        # Parse the incoming request body from API Gateway
        if 'body' in event and event['body'] is not None:
            try:
                body = json.loads(event['body'])
            except json.JSONDecodeError:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    'body': json.dumps({'message': 'Invalid JSON in request body'})
                }
        else:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
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
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
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
        print(f"Successfully stored message: {message_id}")

        # --- SES Email Notification ---
        subject = f"New Contact Form Submission from {name} (Portfolio)"
        body_text = f"""
        You have a new message from your portfolio contact form:

        Name: {name}
        Email: {email}
        Message:
        {message}

        Timestamp: {timestamp}
        Message ID: {message_id}
        """

        try:
            response = ses.send_email(
                Source=SENDER_EMAIL_ADDRESS,
                Destination={'ToAddresses': [RECIPIENT_EMAIL_ADDRESS]},
                Message={
                    'Subject': {'Data': subject},
                    'Body': {'Text': {'Data': body_text}}
                }
            )
            print(f"Email sent successfully! Message ID: {response['MessageId']}")
        except Exception as ses_error:
            print(f"Failed to send email: {ses_error}")
            # You might choose to return a 200 even if email fails, as DynamoDB save succeeded
            # For this project, we'll let the main error handler catch it if it's critical.

        # Return a success response
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Message sent successfully!'})
        }

    except Exception as e:
        print(f"Unhandled error processing contact form: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Internal server error.'})
        }