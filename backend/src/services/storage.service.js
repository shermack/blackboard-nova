import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../config/env.js";

const s3 = new S3Client({
  region: env.awsRegion,
  endpoint: env.awsEndpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.awsAccessKeyId || "test",
    secretAccessKey: env.awsSecretAccessKey || "test"
  }
});

export const buildSubmissionStorageKey = ({ courseId, assignmentId, fileName }) =>
  `assignments/${courseId}/${assignmentId}/${fileName}`;

export const uploadBufferToStorage = async ({ key, body, contentType }) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: env.awsBucket,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  );

  return {
    key,
    url: `${env.awsEndpoint}/${env.awsBucket}/${key}`
  };
};
