export default () => ({
  node_env: process.env.NODE_ENV,
  uploadDirectoryPath: process.env.UPLOAD_DIRECTORY_PATH,
  postgres: {
    pg_host: process.env.PG_HOST,
    pg_database: process.env.PG_DATABASE,
    pg_user: process.env.PG_USER,
    pg_password: process.env.PG_PASSWORD,
  },
  deepgram: {
    apiKey: process.env.DEEPGRAM_API_KEY,
  },
  cloudinary: {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});
