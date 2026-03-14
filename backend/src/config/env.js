import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "super-secret-jwt",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  awsRegion: process.env.AWS_REGION || "us-east-1",
  awsBucket: process.env.AWS_BUCKET || "assignment-platform",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsEndpoint: process.env.AWS_ENDPOINT || "https://s3.amazonaws.com",
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  mailFrom: process.env.MAIL_FROM || "noreply@university.edu"
};
