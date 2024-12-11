const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pethelper',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'pethelper',
    apiKey: process.env.CLOUDINARY_API_KEY || '1234567890',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '1234567890'
  }
};

export default config; 