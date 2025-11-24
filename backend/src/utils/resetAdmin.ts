import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const resetAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');

    // Delete existing admin
    const result = await User.deleteOne({ email: 'admin@urimalzen.com' });
    console.log('Deleted count:', result.deletedCount);

    // Create admin user
    const adminUser = await User.create({
      username: 'Admin',
      email: 'admin@urimalzen.com',
      password: 'admin123!@#', 
      region: 'Korea',
      country: 'South Korea',
      level: {
        cefr: 'C2',
        kiip: 5,
      },
      totalScore: 0,
      isAdmin: true,
    });

    console.log('✅ Admin user recreated successfully!');
    console.log('Email: admin@urimalzen.com');
    console.log('Password: admin123!@#');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error resetting admin user:', error);
    process.exit(1);
  }
};

resetAdmin();
