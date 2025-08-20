// scripts/create-admin.js
// Run this script to create your first admin user
// Usage: node scripts/create-admin.js

const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
const readline = require('readline')

require('dotenv').config({ path: '.env.local' })

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

function questionHidden(query) {
  return new Promise(resolve => {
    process.stdout.write(query)
    process.stdin.setRawMode(true)
    let input = ''
    process.stdin.on('data', function(char) {
      char = char.toString()
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false)
          process.stdout.write('\n')
          process.stdin.removeAllListeners('data')
          resolve(input)
          break
        case '\u0003':
          process.exit()
          break
        case '\b':
        case '\u007f':
          if (input.length > 0) {
            input = input.slice(0, -1)
            process.stdout.write('\b \b')
          }
          break
        default:
          input += char
          process.stdout.write('*')
          break
      }
    })
  })
}

async function createAdminUser() {
  console.log('🚀 BAM Admin User Creation Script\n')

  try {
    // Check MongoDB URI
    const uri = process.env.MONGODB_URI
    if (!uri) {
      console.error('❌ MONGODB_URI not found in environment variables')
      console.log('Please set MONGODB_URI in your .env.local file')
      process.exit(1)
    }

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...')
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db('bam_portfolio')
    console.log('✅ Connected to MongoDB\n')

    // Get admin details
    const name = await question('👤 Enter admin name: ')
    const email = await question('📧 Enter admin email: ')
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format')
      process.exit(1)
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() })
    if (existingUser) {
      console.error('❌ User with this email already exists')
      process.exit(1)
    }

    const password = await questionHidden('🔒 Enter admin password (hidden): ')
    
    const confirmPassword = await questionHidden('🔒 Confirm password (hidden): ')


    if (password !== confirmPassword) {
      console.error('❌ Passwords do not match')
      process.exit(1)
    }

    if (password.length < 16) {
      console.error('❌ Password must be at least 16 characters long')
      process.exit(1)
    }

    // Hash password
    console.log('\n🔐 Hashing password...')
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user
    console.log('👨‍💼 Creating admin user...')
    const user = {
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin',
      name,
      createdAt: new Date(),
      isActive: true
    }

    const result = await db.collection('users').insertOne(user)
    
    console.log('\n✅ Admin user created successfully!')
    console.log(`📝 User ID: ${result.insertedId}`)
    console.log(`👤 Name: ${name}`)
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Role: admin`)
    
    console.log('\n🎉 You can now login at: http://localhost:3000/admin/login')

    await client.close()
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

// Run the script
createAdminUser().catch(console.error)