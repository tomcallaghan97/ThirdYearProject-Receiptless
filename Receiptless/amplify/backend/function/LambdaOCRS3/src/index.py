import json
import boto3
import os
import urllib.parse
from datetime import datetime

print('Loading function')

s3 = boto3.client('s3')

textract = boto3.client('textract')

def getTextractData(bucketName, documentKey):
    print('Loading getTextractData')
    response = textract.detect_document_text(
        Document={
            'S3Object': {
                'Bucket': bucketName,
                'Name': documentKey
            }
        })
        
    detectedText = ''

    for item in response['Blocks']:
        if item['BlockType'] == 'LINE':
            detectedText += item['Text'] + '\n'
            
    return detectedText
    
def textToDynamo(textractData, key):
    file = key
    file2= file.split('/')
    sub = file2[1]
    print(sub)
    c = file2[2]
    print(c)
    receiptID = file2[3]
    print(receiptID)
    results = textractData
    results = results.split("\n")
    merchantName = results[0].upper()
    print("Store Name is: " + merchantName)
    datey = ""

    j = 0
    while j < len(results):
        results[j]= results[j].upper()
        if "DATE" in results[j]:
            datey = results[j][5:]
            break
        else:
            j=j+1
        
    if datey == "":
        datey = "N/A"

    i = 0
    while i < len(results):
        results[i]=results[i].upper()
        if "TOTAL" in results[i]:
            total = results[i+1][1:]
            print("The total is: " + results[i+1][1:])
            break
        else:
            i=i+1

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('receiptlessDB-dev')

    table.put_item(
        Item={
            'receiptID':receiptID,
            'userID':sub,
            'Category': c,
            'StoreName':merchantName,
            'ReceiptDate':datey,
            'ReceiptTotal': total,
            'TimeStamp': str(datetime.today())
        }
    )
        

    

def lambda_handler(event, context):
    print(event)
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        detectedText = getTextractData(bucket, key)
        textToDynamo(detectedText, key)
        
        return 'Processing Done!'

    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e
