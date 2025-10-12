# AWS Setup Guide

## Quick Setup (5 minutes)

### 1. Create S3 Bucket
```bash
aws s3 mb s3://osce-files-YOUR-NAME
aws s3api put-public-access-block --bucket osce-files-YOUR-NAME --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 2. Add Environment Variables in Amplify Console

Go to: Amplify Console → Your App → Environment Variables

Add:
- `USE_S3` = `true`
- `S3_BUCKET` = `osce-files-YOUR-NAME`
- `AWS_REGION` = `us-east-1`
- `AWS_ACCESS_KEY_ID` = (from IAM)
- `AWS_SECRET_ACCESS_KEY` = (from IAM)

### 3. Create IAM User (for Amplify)

1. Go to IAM Console → Users → Create User
2. Name: `amplify-osce-app`
3. Attach policy: `AmazonS3FullAccess`
4. Create access key → Copy credentials
5. Add to Amplify environment variables above

### 4. Redeploy

Click "Redeploy" in Amplify - done!

## What This Does

- **Local dev**: Uses `data/sessions.json` file
- **AWS production**: Uses S3 bucket for sessions
- **Files**: Uploads/outputs stored in S3
- **No database needed**: JSON in S3 works perfectly

## Cost

- S3: ~$0.023/GB/month
- For 1000 sessions: ~$0.10/month
- Basically free!
