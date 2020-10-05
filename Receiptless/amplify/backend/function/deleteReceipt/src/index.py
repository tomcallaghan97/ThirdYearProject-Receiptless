import json
import boto3    

def lambda_handler(event, context):
    eventBody = json.loads(json.dumps(event))['body']
    print(event)
    http = json.loads(json.dumps(event))['httpMethod']
    print(http)
    if http == 'DELETE':
        receiptID = json.loads(eventBody)['ReceiptID']
        category = json.loads(eventBody)['Category']
        sub = json.loads(eventBody)['Sub']
        txtID = receiptID[:-4] + '.txt'
        s3 = boto3.resource('s3')

        path = "Images/" + str(sub) + '/' + str(category) + '/' + str(receiptID)
        obj = s3.Object("receipts-bucket121338-dev", path)
        obj.delete()

        secondpath = "textDoc/" + str(sub) + '/' + str(category) + '/' + str(txtID)
        obj = s3.Object("receipts-bucket121338-dev", secondpath)
        obj.delete()

        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('receiptlessDB-dev')

        table.delete_item(
        Key={
            'userID': sub,
            'receiptID': receiptID
        }
    )
        return {
            'statusCode': 200,
            'body': json.dumps(receiptID)
        }
    else:
        totals = json.loads(eventBody)['Total']
        email = json.loads(eventBody)['Email']
        totalList = str(totals)
        print(email)
        boto3.client('ses', 'eu-west-1').send_email(
        Source = 'receiptless123@gmail.com',
        Destination={
            'ToAddresses': [
                email
            ]
        },
        Message={
            'Subject': {
                'Data': "7 Day Report"
            },
            'Body': {
                'Text': {
                    'Data': "Here are you weekly totals: "+"\n"+ "\n" +totalList
                }
            }
        }
    )
        return {
            'statusCode': 200,
            'body': json.dumps(email)
        }

