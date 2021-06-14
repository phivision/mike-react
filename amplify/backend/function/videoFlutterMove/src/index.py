import json
import urllib.parse
import boto3

print('Loading function')

s3 = boto3.client('s3')


def handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))

    # Get the object from the event and show its content type
    bucket = event['Records'][0]['s3']['bucket']['name']
    s3_bucket = boto3.resource('s3')
    my_bucket = s3_bucket.Bucket(bucket)
    s3 = boto3.client('s3')

    for object_summary in my_bucket.objects.filter(Prefix="public/flutter_input/"):
       print(object_summary.key)
       copy_source = {'Bucket': bucket,'Key': object_summary.key}
       destination = "input/" + object_summary.key.split("public/flutter_input/",1)[1]
       print(destination)
       s3.copy_object(CopySource=copy_source, Bucket=bucket, Key=destination)
       s3.delete_object(Bucket = bucket, Key = object_summary.key)