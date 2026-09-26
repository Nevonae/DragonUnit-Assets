import { S3Client } from "@aws-sdk/client-s3";

export const b2Client = new S3Client({
  region: process.env.B2_REGION,
  endpoint: process.env.B2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});

export const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME!;