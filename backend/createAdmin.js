/**
 * Run this once to create the admin account:
 *   node createAdmin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN_EMAIL    = 'admin@codingcollege.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_NAME     = 'Admin';

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log('✅ Existing user promoted to admin:', ADMIN_EMAIL);
    } else {
      console.log('ℹ️  Admin already exists:', ADMIN_EMAIL);
    }
    await mongoose.disconnect();
    return;
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
    isEmailVerified: true,
    authProvider: 'local',
  });

  console.log('✅ Admin account created!');
  console.log('   Email   :', ADMIN_EMAIL);
  console.log('   Password:', ADMIN_PASSWORD);
  console.log('\n👉 You can now login at http://localhost:5173/login');
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
