import json
import boto3    

def lambda_handler(event, context):
    sub = event['queryStringParameters']['sub']
    client = boto3.client('dynamodb')

    resp = client.query(
    TableName='receiptlessDB-dev',
    IndexName='userID-receiptID-index',
    ExpressionAttributeValues={
        ':v1': {
            'S': sub
        },
    },
    KeyConditionExpression='userID= :v1',
    )

    items = resp.get('Items')
    responseList = []
    for n in items:
        itemDic = {}
        storeName = n['StoreName']['S']
        receiptDate = n['ReceiptDate']['S']
        receiptTotal = n['ReceiptTotal']['S']
        receiptID = n['receiptID']['S']
        category = n['Category']['S']
        timeStamp = n['TimeStamp']['S']
        itemDic['StoreName'] = storeName
        itemDic['ReceiptTotal'] = receiptTotal
        itemDic['ReceiptDate'] = receiptDate
        itemDic['receiptID'] = receiptID
        itemDic['Category'] = category
        itemDic['TimeStamp'] = timeStamp
        responseList.append(itemDic)
        print(responseList)
   
    return {
        'statusCode': 200,
        'body': json.dumps(responseList)
    }