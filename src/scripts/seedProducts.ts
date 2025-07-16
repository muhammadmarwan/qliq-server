import mongoose from 'mongoose';
import User from '../models/User'; // adjust path as needed

async function seedUsers() {
  // Clear existing users to avoid duplicates (optional)
  await User.deleteMany({});

  // Create root user
  const rootUser = await User.create({
    name: 'Root User',
    email: 'root@example.com',
    password: 'hashed_password_here',
    level: 0,
    downlines: [],
  });

  // Create level 1 users
  const userLevel1A = await User.create({
    name: 'User Level 1A',
    email: 'user1a@example.com',
    password: 'hashed_password_here',
    referrer: rootUser._id,
    level: 1,
    downlines: [],
  });

  const userLevel1B = await User.create({
    name: 'User Level 1B',
    email: 'user1b@example.com',
    password: 'hashed_password_here',
    referrer: rootUser._id,
    level: 1,
    downlines: [],
  });

  // Assign downlines to rootUser with explicit casting
  rootUser.downlines = [
    userLevel1A._id as mongoose.Types.ObjectId,
    userLevel1B._id as mongoose.Types.ObjectId,
  ];
  await rootUser.save();

  // Create level 2 users
  const userLevel2A = await User.create({
    name: 'User Level 2A',
    email: 'user2a@example.com',
    password: 'hashed_password_here',
    referrer: userLevel1A._id,
    level: 2,
    downlines: [],
  });

  const userLevel2B = await User.create({
    name: 'User Level 2B',
    email: 'user2b@example.com',
    password: 'hashed_password_here',
    referrer: userLevel1A._id,
    level: 2,
    downlines: [],
  });

  const userLevel2C = await User.create({
    name: 'User Level 2C',
    email: 'user2c@example.com',
    password: 'hashed_password_here',
    referrer: userLevel1B._id,
    level: 2,
    downlines: [],
  });

  // Assign downlines to userLevel1A with casting
  userLevel1A.downlines = [
    userLevel2A._id as mongoose.Types.ObjectId,
    userLevel2B._id as mongoose.Types.ObjectId,
  ];
  await userLevel1A.save();

  // Assign downlines to userLevel1B (push with casting)
  userLevel1B.downlines.push(userLevel2C._id as mongoose.Types.ObjectId);
  await userLevel1B.save();

  // Create level 3 user
  const userLevel3A = await User.create({
    name: 'User Level 3A',
    email: 'user3a@example.com',
    password: 'hashed_password_here',
    referrer: userLevel2A._id,
    level: 3,
    downlines: [],
  });

  // Assign downlines to userLevel2A
  userLevel2A.downlines.push(userLevel3A._id as mongoose.Types.ObjectId);
  await userLevel2A.save();

  console.log('Users seeded successfully!');
}

export default seedUsers;
