// Central blog/photo MongoDB names. Import-safe everywhere (no mongodb import,
// so this never triggers the MONGODB_URI check in client bundles).
export const BLOG_DB = 'bam_portfolio'

export const COLLECTIONS = {
  blogPosts: 'blog_posts', // unified automated blog (CMS + migrated static)
  blogMetadata: 'blog_metadata', // legacy override layer (decommissioned in Phase 6)
  photos: 'photos',
  clientGalleries: 'client_galleries',
} as const
