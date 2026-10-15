import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '../../../../../lib/db/mongodb'
import { v2 as cloudinary } from 'cloudinary';
import { libraryFilesUnder, releaseGalleryReference } from '@/lib/photos/references'
import { galleryFilesToDelete } from '@/lib/photos/usage'

export async function PUT(request: NextRequest, props: { params: Promise<{ galleryId: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    const { _id, ...updateData } = data
    await db.collection('client_galleries').updateOne(
      { galleryId: params.galleryId },
      { $set: { ...updateData, updatedAt: new Date() } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ galleryId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db('bam_portfolio')

  const folder = `bam-photography/galleries/${params.galleryId}`
  const gallery = await db
    .collection('client_galleries')
    .findOne({ galleryId: params.galleryId }, { projection: { photos: 1 } })
  const libraryOwned = await libraryFilesUnder(db, folder)

  // Delete from database, and drop this gallery from library photos' usage.
  await db.collection('client_galleries').deleteOne({ galleryId: params.galleryId })
  await releaseGalleryReference(db, params.galleryId)

  // Delete from Cloudinary. A library photo made from one of this gallery's
  // uploads still lives in its folder, so when one exists, delete only the
  // gallery's own files by id instead of purging the whole folder.
  if (libraryOwned.size === 0) {
    // Trailing slash: a bare prefix would also purge gallery `g10` when deleting `g1`.
    await cloudinary.api.delete_resources_by_prefix(`${folder}/`)
  } else {
    const files = galleryFilesToDelete(gallery?.photos, folder, libraryOwned)
    for (let i = 0; i < files.length; i += 100) {
      await cloudinary.api.delete_resources(files.slice(i, i + 100))
    }
  }

  return NextResponse.json({ success: true })
}