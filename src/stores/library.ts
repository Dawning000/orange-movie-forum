import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LibraryEntry, LibraryList, LibrarySnapshot, WatchStatus } from '@/types/library'

const STORAGE_KEY = 'library_snapshot_v1'

function nowIso(): string { return new Date().toISOString() }

export const useLibraryStore = defineStore('library', () => {
  const entries = ref<Record<string | number, LibraryEntry>>({})
  const lists = ref<Record<string, LibraryList>>({})

  // load from localStorage
  const load = (): void => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as LibrarySnapshot
      entries.value = parsed.entries || {}
      lists.value = parsed.lists || {}
    } catch {
      // ignore
    }
  }

  const persist = (): void => {
    const data: LibrarySnapshot = { entries: entries.value, lists: lists.value }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  // getters
  const wantList = computed(() => Object.values(entries.value).filter(e => e.status === 'want'))
  const watchingList = computed(() => Object.values(entries.value).filter(e => e.status === 'watching'))
  const watchedList = computed(() => Object.values(entries.value).filter(e => e.status === 'watched'))

  function upsertEntry(payload: Omit<LibraryEntry, 'updatedAt'>): LibraryEntry {
    const key = payload.mediaId
    const existing = entries.value[key]
    const entry: LibraryEntry = {
      title: payload.title,
      mediaId: payload.mediaId,
      mediaType: payload.mediaType,
      poster: payload.poster,
      year: payload.year,
      rating: payload.rating ?? existing?.rating,
      tags: payload.tags ?? existing?.tags ?? [],
      status: payload.status ?? existing?.status,
      notes: payload.notes ?? existing?.notes,
      updatedAt: nowIso()
    }
    entries.value[key] = entry
    persist()
    return entry
  }

  function setStatus(mediaId: string | number, status: WatchStatus | undefined): void {
    const e = entries.value[mediaId]
    if (!e) return
    e.status = status
    e.updatedAt = nowIso()
    persist()
  }

  function setRating(mediaId: string | number, rating: number | undefined): void {
    const e = entries.value[mediaId]
    if (!e) return
    e.rating = rating
    e.updatedAt = nowIso()
    persist()
  }

  function setTags(mediaId: string | number, tags: string[]): void {
    const e = entries.value[mediaId]
    if (!e) return
    e.tags = tags
    e.updatedAt = nowIso()
    persist()
  }

  function ensureList(id: string, title?: string): LibraryList {
    if (!lists.value[id]) {
      lists.value[id] = {
        id,
        title: title || '未命名片单',
        itemIds: [],
        isPublic: true,
        ownerUserId: 0,
        createdAt: nowIso(),
        updatedAt: nowIso()
      }
      persist()
    }
    return lists.value[id]
  }

  function addToList(listId: string, mediaId: string | number): void {
    const list = ensureList(listId)
    if (!list.itemIds.includes(mediaId)) list.itemIds.push(mediaId)
    list.updatedAt = nowIso()
    persist()
  }

  function removeFromList(listId: string, mediaId: string | number): void {
    const list = lists.value[listId]
    if (!list) return
    list.itemIds = list.itemIds.filter(id => id !== mediaId)
    list.updatedAt = nowIso()
    persist()
  }

  function exportShareUrl(listId: string): string {
    return `${location.origin}/list/${encodeURIComponent(listId)}`
  }

  // init
  load()

  return {
    entries, lists,
    wantList, watchingList, watchedList,
    upsertEntry, setStatus, setRating, setTags,
    ensureList, addToList, removeFromList, exportShareUrl
  }
})


