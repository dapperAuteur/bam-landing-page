console.log('_migrate-photos.ts file');

// // scripts/migrate-photos.ts
// import { MongoClient, ObjectId } from 'mongodb'
// import { config } from 'dotenv'
// import { join } from 'path'

// // Load environment variables from .env.local
// config({ path: join(process.cwd(), '.env.local') })

// // Check different possible environment variable names
// const MONGODB_URI = 
//   process.env.MONGODB_URI || 
//   process.env.MONGO_URI || 
//   process.env.DATABASE_URL ||
//   process.env.MONGODB_CONNECTION_STRING

// const DB_NAME = 'bam_portfolio'

// console.log('🔍 Environment check:')
// console.log('- Current working directory:', process.cwd())
// console.log('- Looking for .env.local file...')
// console.log('- MONGODB_URI found:', MONGODB_URI ? '✅ Yes' : '❌ No')

// if (!MONGODB_URI) {
//   console.error(`
// ❌ MongoDB connection string not found!

// Please check your .env.local file contains one of these variables:
// - MONGODB_URI
// - MONGO_URI  
// - DATABASE_URL
// - MONGODB_CONNECTION_STRING

// Example .env.local content:
// MONGODB_URI="mongodb://localhost:27017"
// # or for MongoDB Atlas:
// MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
// `)
//   process.exit(1)
// }

// if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
//   console.error(`
// ❌ Invalid MongoDB connection string format!

// Current value: ${MONGODB_URI}

// Expected format:
// - Local: mongodb://localhost:27017
// - Atlas: mongodb+srv://username:password@cluster.mongodb.net/database
// `)
//   process.exit(1)
// }

// interface Photo {
//   id: string
//   cloudinaryId: string
//   originalUrl: string
//   thumbnailUrl: string
//   title?: string
//   description?: string
//   tags: string[]
//   category: 'sports' | 'events' | 'portraits' | 'products' | 'other'
//   metadata: {
//     width: number
//     height: number
//     format: string
//     size: number
//   }
//   usedIn: {
//     galleries: string[]
//     blogs: string[]
//     portfolio: boolean
//   }
//   clientData?: {
//     likes: number
//     isFavorite: boolean
//     comments: Array<{
//       id: string
//       text: string
//       timestamp: Date | string
//     }>
//   }
//   uploadedAt: Date
//   updatedAt: Date
// }

// async function migratePhotosToLibrary() {
//   console.log('🚀 Starting photo migration...')
//   console.log(`📊 Connecting to: ${MONGODB_URI?.replace(/\/\/.*@/, '//***:***@')}`)
  
//   const client = new MongoClient(MONGODB_URI)
  
//   try {
//     await client.connect()
//     console.log('✅ Connected to MongoDB')
    
//     const db = client.db(DB_NAME)
//     console.log(`📂 Using database: ${DB_NAME}`)

//     // 1. Check if photos collection already exists
//     const photosCount = await db.collection('photos').countDocuments()
//     if (photosCount > 0) {
//       console.log(`⚠️  Photos collection already contains ${photosCount} photos`)
//       console.log('Run with "verify" to check migration status, or "rollback" to start fresh')
//       return
//     }

//     // 2. Get all existing galleries with embedded photos
//     const galleries = await db.collection('client_galleries').find({
//       photos: { $exists: true, $ne: [] }
//     }).toArray()

//     console.log(`📁 Found ${galleries.length} galleries with photos`)

//     if (galleries.length === 0) {
//       console.log('✅ No galleries with embedded photos found. Migration not needed.')
//       return
//     }

//     let totalPhotos = 0
//     let migratedPhotos = 0

//     // 3. Process each gallery
//     for (const gallery of galleries) {
//       console.log(`\n📸 Processing gallery: ${gallery.galleryId}`)
//       console.log(`   Client: ${gallery.clientName}`)
//       console.log(`   Event: ${gallery.eventName}`)
      
//       if (!gallery.photos || gallery.photos.length === 0) {
//         console.log('  ⏭️  No photos to migrate')
//         continue
//       }

//       console.log(`  📷 Found ${gallery.photos.length} photos`)
//       totalPhotos += gallery.photos.length
//       const photoIds: string[] = []

//       // 4. Migrate each embedded photo to central library
//       for (const embeddedPhoto of gallery.photos) {
//         try {
//           // Transform embedded photo to central photo format
//           const centralPhoto: Omit<Photo, 'id'> = {
//             cloudinaryId: embeddedPhoto.cloudinaryId || embeddedPhoto.id,
//             originalUrl: embeddedPhoto.originalUrl,
//             thumbnailUrl: embeddedPhoto.thumbnailUrl,
//             title: embeddedPhoto.title || `Photo from ${gallery.eventName}`,
//             description: embeddedPhoto.description || undefined,
//             tags: [
//               'client', // Mark as client photo
//               gallery.clientName.toLowerCase().replace(/\s+/g, '-'),
//               gallery.eventName.toLowerCase().replace(/\s+/g, '-')
//             ].filter(Boolean),
//             category: 'events', // Default category for client photos
//             metadata: embeddedPhoto.metadata || {
//               width: 1920,
//               height: 1080,
//               format: 'jpg',
//               size: 1024000
//             },
//             usedIn: {
//               galleries: [gallery.galleryId],
//               blogs: [],
//               portfolio: false // Client photos not in portfolio by default
//             },
//             // Preserve client interaction data
//             clientData: {
//               likes: embeddedPhoto.likes || 0,
//               isFavorite: embeddedPhoto.isFavorite || false,
//               comments: embeddedPhoto.comments || []
//             },
//             uploadedAt: embeddedPhoto.uploadedAt ? new Date(embeddedPhoto.uploadedAt) : new Date(),
//             updatedAt: new Date()
//           }

//           // Insert into central photos collection
//           const insertResult = await db.collection('photos').insertOne(centralPhoto)
//           photoIds.push(insertResult.insertedId.toString())
//           migratedPhotos++
          
//           console.log(`    ✅ ${centralPhoto.title}`)
          
//         } catch (photoError) {
//           console.error(`    ❌ Failed to migrate photo: ${embeddedPhoto.id}`, photoError)
//         }
//       }

//       // 5. Update gallery to reference photos instead of embedding them
//       await db.collection('client_galleries').updateOne(
//         { _id: gallery._id },
//         {
//           $set: {
//             photoIds: photoIds,
//             updatedAt: new Date(),
//             // Keep original photos as backup during transition
//             _photosBackup: gallery.photos,
//             _migrationDate: new Date()
//           },
//           $unset: {
//             photos: 1 // Remove embedded photos
//           }
//         }
//       )

//       console.log(`  🔗 Updated gallery with ${photoIds.length} photo references`)
//     }

//     // 6. Create indexes for performance
//     console.log('\n📊 Creating database indexes...')
//     await db.collection('photos').createIndex({ tags: 1 })
//     await db.collection('photos').createIndex({ category: 1 })
//     await db.collection('photos').createIndex({ 'usedIn.galleries': 1 })
//     await db.collection('photos').createIndex({ 'usedIn.blogs': 1 })
//     await db.collection('photos').createIndex({ 'usedIn.portfolio': 1 })
//     await db.collection('photos').createIndex({ uploadedAt: -1 })

//     console.log('\n🎉 Migration completed successfully!')
//     console.log(`📊 Migration Statistics:`)
//     console.log(`   • Total photos found: ${totalPhotos}`)
//     console.log(`   • Successfully migrated: ${migratedPhotos}`)
//     console.log(`   • Galleries updated: ${galleries.length}`)
//     console.log(`   • Database indexes created: 6`)
//     console.log(`\n📋 Next Steps:`)
//     console.log(`   1. Test your application to ensure everything works`)
//     console.log(`   2. Run "verify" command to double-check migration`)
//     console.log(`   3. If satisfied, the old photos are backed up as _photosBackup`)

//   } catch (error) {
//     console.error('❌ Migration failed:', error)
//     throw error
//   } finally {
//     await client.close()
//     console.log('🔌 Database connection closed')
//   }
// }

// // Helper function to verify migration
// async function verifyMigration() {
//   console.log('\n🔍 Verifying migration...')
  
//   const client = new MongoClient(MONGODB_URI)
//   await client.connect()
//   const db = client.db(DB_NAME)

//   try {
//     const photosCount = await db.collection('photos').countDocuments()
//     const galleriesWithPhotoIds = await db.collection('client_galleries').countDocuments({
//       photoIds: { $exists: true, $ne: [] }
//     })
//     const galleriesWithEmbeddedPhotos = await db.collection('client_galleries').countDocuments({
//       photos: { $exists: true, $ne: [] }
//     })
//     const totalGalleries = await db.collection('client_galleries').countDocuments()

//     console.log(`📊 Verification Results:`)
//     console.log(`   • Photos in central library: ${photosCount}`)
//     console.log(`   • Total galleries: ${totalGalleries}`)
//     console.log(`   • Galleries using photo references: ${galleriesWithPhotoIds}`)
//     console.log(`   • Galleries still with embedded photos: ${galleriesWithEmbeddedPhotos}`)

//     if (galleriesWithEmbeddedPhotos > 0) {
//       console.log('\n⚠️  Some galleries still have embedded photos. Migration may be incomplete.')
//       console.log('   Run migration again or check for errors.')
//     } else if (photosCount > 0) {
//       console.log('\n✅ Migration verified successfully!')
//       console.log('   All galleries are using the new photo reference system.')
//     } else {
//       console.log('\n📭 No photos found in central library.')
//       console.log('   Either no migration has been run, or there were no photos to migrate.')
//     }

//     // Sample some data
//     if (photosCount > 0) {
//       console.log('\n🔍 Sample data check:')
//       const samplePhoto = await db.collection('photos').findOne()
//       console.log('   Sample photo structure looks good:', {
//         id: samplePhoto?._id.toString(),
//         cloudinaryId: samplePhoto?.cloudinaryId ? '✅' : '❌',
//         urls: samplePhoto?.originalUrl && samplePhoto.thumbnailUrl ? '✅' : '❌',
//         metadata: samplePhoto?.metadata ? '✅' : '❌',
//         usedIn: samplePhoto?.usedIn ? '✅' : '❌'
//       })
//     }

//   } finally {
//     await client.close()
//   }
// }

// // Helper function to rollback migration (if needed)
// async function rollbackMigration() {
//   console.log('🔄 Rolling back migration...')
//   console.log('⚠️  This will restore embedded photos and delete the central photo library!')
  
//   // In a real script, you might want to add a confirmation prompt here
  
//   const client = new MongoClient(MONGODB_URI)
//   await client.connect()
//   const db = client.db(DB_NAME)

//   try {
//     // Restore embedded photos from backup
//     const galleries = await db.collection('client_galleries').find({
//       _photosBackup: { $exists: true }
//     }).toArray()

//     console.log(`📁 Found ${galleries.length} galleries to restore`)

//     for (const gallery of galleries) {
//       await db.collection('client_galleries').updateOne(
//         { _id: gallery._id },
//         {
//           $set: {
//             photos: gallery._photosBackup
//           },
//           $unset: {
//             photoIds: 1,
//             _photosBackup: 1,
//             _migrationDate: 1
//           }
//         }
//       )
//       console.log(`  ✅ Restored ${gallery.galleryId}`)
//     }

//     // Clear central photos collection
//     const deleteResult = await db.collection('photos').deleteMany({})
//     console.log(`🗑️  Deleted ${deleteResult.deletedCount} photos from central library`)

//     console.log('\n✅ Migration rolled back successfully!')
//     console.log(`📊 Rollback Statistics:`)
//     console.log(`   • Galleries restored: ${galleries.length}`)
//     console.log(`   • Photos deleted from central library: ${deleteResult.deletedCount}`)

//   } finally {
//     await client.close()
//   }
// }

// // Main execution
// async function main() {
//   const command = process.argv[2]

//   console.log(`🚀 BAM Photo Library Migration Tool`)
//   console.log(`📅 ${new Date().toLocaleString()}\n`)

//   switch (command) {
//     case 'migrate':
//       await migratePhotosToLibrary()
//       console.log('\n🔍 Running verification...')
//       await verifyMigration()
//       break
//     case 'verify':
//       await verifyMigration()
//       break
//     case 'rollback':
//       await rollbackMigration()
//       break
//     default:
//       console.log(`
// Usage: npx tsx scripts/migrate-photos.ts [command]

// Commands:
//   migrate   - Migrate embedded photos to central library
//   verify    - Check migration status  
//   rollback  - Restore embedded photos (destructive!)

// Examples:
//   npx tsx scripts/migrate-photos.ts migrate
//   npx tsx scripts/migrate-photos.ts verify
//   npx tsx scripts/migrate-photos.ts rollback
// `)
//       process.exit(1)
//   }
// }

// if (require.main === module) {
//   main().catch((error) => {
//     console.error('\n❌ Script failed with error:', error.message)
//     if (error.name === 'MongoParseError') {
//       console.error('\n💡 This looks like a MongoDB connection string issue.')
//       console.error('   Check your .env.local file and ensure MONGODB_URI is set correctly.')
//     }
//     process.exit(1)
//   })
// }

// export { migratePhotosToLibrary, verifyMigration, rollbackMigration }