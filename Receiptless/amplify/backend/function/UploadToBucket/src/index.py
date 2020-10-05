import json
import boto3
import base64
import uuid

def lambda_handler(event, context):
    eventBody = json.loads(json.dumps(event))['body']
    imageBase64 = json.loads(eventBody)['Image']
    category = json.loads(eventBody)['Category']
    sub = json.loads(eventBody)['Sub']
    
    decode_image = base64.b64decode(imageBase64)
    file_path = 'Images/' + str(sub) +'/' + str(category) + '/' + str(uuid.uuid4()) + '.jpg'
    s3 = boto3.client('s3')
    
    try:
        s3_response = s3.put_object(Bucket='receipts-bucket121338-dev', Key=file_path, Body=decode_image, ContentType = 'image/jpg')    
    except Exception as e:
        raise IOError(e)
        
    return {
        'statusCode': 200,
        'body': json.dumps('Uploaded')
    }