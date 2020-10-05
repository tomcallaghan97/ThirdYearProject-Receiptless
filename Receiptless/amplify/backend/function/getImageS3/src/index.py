import boto3
import base64
import json

def lambda_handler(event, context):
    sub = event['queryStringParameters']['sub']
    receiptID = event['queryStringParameters']['receiptID']
    category = event['queryStringParameters']['category']

    img_path = 'Images/' + sub + '/' + category + '/' + receiptID

    s3 = boto3.resource('s3')

    obj = s3.Object("receipts-bucket121338-dev",  img_path)

    response = obj.get()     

    img = response[u'Body'].read()


    myObj = [base64.b64encode(img)]
    return_json = str(myObj[0])
    return_json = return_json.replace("b'","")
    encoded_image = return_json.replace("'","")

    return {
        'statusCode': 200,
        'body': json.dumps(encoded_image)
    }
