import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@urimalzen.com' });

    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email: admin@urimalzen.com');
      console.log('Password: admin123!@#');
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      username: 'Admin',
      email: 'admin@urimalzen.com',
      password: 'admin123!@#', // Will be hashed by pre-save hook
      region: 'Korea',
      country: 'South Korea',
      level: {
        cefr: 'C2',
        kiip: 5,
      },
      totalScore: 0,
      isAdmin: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@urimalzen.com');
    console.log('🔑 Password: admin123!@#');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please change the password after first login!');

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
