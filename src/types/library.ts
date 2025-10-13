export type WatchStatus = 'want' | 'watching' | 'watched'

export interface LibraryEntry {
  mediaId: string | number
  mediaType: 'movie' | 'tv' | 'anime'
  title: string
  poster?: string
  year?: number
  rating?: number // personal rating 0-10
  tags?: string[]
  status?: WatchStatus
  notes?: string
  updatedAt: string
}

export interface LibraryList {
  id: string
  title: string
  description?: string
  cover?: string
  itemIds: Array<string | number>
  isPublic: boolean
  ownerUserId: number | string
  createdAt: string
  updatedAt: string
}

export interface LibrarySnapshot {
  entries: Record<string | number, LibraryEntry>
  lists: Record<string, LibraryList>
}

