// scripts/create-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// --- Admin User Details ---
// IMPORTANT: Change these values before running the script.
// Use a strong, unique password.
const ADMIN_EMAIL = "bam@awews.com";
const ADMIN_PASSWORD = "example";
const ADMIN_NAME = "BAM";
// const ADMIN_LAST_NAME = "BAM";
// --------------------------

// Manually define the User schema to match your Mongoose model
// This is necessary because we are in a .js script file and can't directly import the TS model without a build step.
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['User', 'Teammate', 'Admin'], default: 'User' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined in your .env.local file.");
    process.exit(1);
  }

  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Database connected successfully.");

    // 1. Check if the admin user already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`Admin user with email ${ADMIN_EMAIL} already exists.`);
      return;
    }

    // 2. Hash the password
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
    console.log("Password hashed.");

    // 3. Create the new admin user
    const adminUser = new User({
      name: ADMIN_NAME,
      // lastName: ADMIN_LAST_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'Admin',
    });

    // 4. Save the user to the database
    console.log("Saving admin user to the database...");
    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log("   Role: Admin");

  } catch (error) {
    console.error("❌ An error occurred while creating the admin user:");
    console.error(error);
  } finally {
    // 5. Disconnect from the database
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

createAdmin();
