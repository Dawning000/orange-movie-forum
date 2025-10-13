import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { SearchQueryParams, SearchResponse, SearchItem } from '@/types/search'
import * as api from '@/api/search'

function parseArray(value: string | string[] | null | undefined): string[] | undefined {
  if (!value) return undefined
  const v = Array.isArray(value) ? value.join(',') : value
  const arr = v.split(',').map(s => s.trim()).filter(Boolean)
  return arr.length ? arr : undefined
}

function parseNumber(value: string | string[] | null | undefined): number | undefined {
  if (!value) return undefined
  const v = Array.isArray(value) ? value[0] : value
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

export const useSearchStore = defineStore('search', () => {
  // routing
  const route = useRoute()
  const router = useRouter()

  // query state
  const q = ref<string>('')
  const genres = ref<string[]>([])
  const regions = ref<string[]>([])
  const yearGte = ref<number | undefined>(undefined)
  const yearLte = ref<number | undefined>(undefined)
  const ratingGte = ref<number | undefined>(undefined)
  const ratingLte = ref<number | undefined>(undefined)
  const sort = ref<SearchQueryParams['sort']>('relevance_desc')
  const page = ref<number>(1)
  const pageSize = ref<number>(24)

  // results state
  const items = ref<SearchItem[]>([])
  const total = ref<number>(0)
  const hasMore = ref<boolean>(false)
  const facets = ref<SearchResponse['facets']>()
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // abort control
  let abortController: AbortController | null = null

  const params = computed<SearchQueryParams>(() => ({
    q: q.value || undefined,
    genres: genres.value.length ? genres.value : undefined,
    regions: regions.value.length ? regions.value : undefined,
    yearGte: yearGte.value,
    yearLte: yearLte.value,
    ratingGte: ratingGte.value,
    ratingLte: ratingLte.value,
    sort: sort.value,
    page: page.value,
    pageSize: pageSize.value
  }))

  function syncFromRoute(): void {
    const query = route.query
    q.value = (query.q as string) || ''
    genres.value = parseArray(query.genres) || []
    regions.value = parseArray(query.regions) || []
    yearGte.value = parseNumber(query.year_gte)
    yearLte.value = parseNumber(query.year_lte)
    ratingGte.value = parseNumber(query.rating_gte)
    ratingLte.value = parseNumber(query.rating_lte)
    sort.value = (query.sort as any) || 'relevance_desc'
    page.value = parseNumber(query.page) || 1
    pageSize.value = parseNumber(query.page_size) || 24
  }

  async function syncToRoute(replace = false): Promise<void> {
    const query: Record<string, any> = {}
    if (q.value) query.q = q.value
    if (genres.value.length) query.genres = genres.value.join(',')
    if (regions.value.length) query.regions = regions.value.join(',')
    if (yearGte.value !== undefined) query.year_gte = yearGte.value
    if (yearLte.value !== undefined) query.year_lte = yearLte.value
    if (ratingGte.value !== undefined) query.rating_gte = ratingGte.value
    if (ratingLte.value !== undefined) query.rating_lte = ratingLte.value
    if (sort.value) query.sort = sort.value
    if (page.value && page.value !== 1) query.page = page.value
    if (pageSize.value && pageSize.value !== 24) query.page_size = pageSize.value

    const nav = { name: route.name || 'Search', query }
    if (replace) await router.replace(nav)
    else await router.push(nav)
  }

  async function runSearch(): Promise<void> {
    if (abortController) abortController.abort()
    abortController = new AbortController()
    loading.value = true
    error.value = null
    try {
      const res = await api.search(params.value, abortController.signal)
      items.value = res.items
      total.value = res.total
      hasMore.value = res.hasMore
      facets.value = res.facets
    } catch (e: any) {
      if (e?.name === 'AbortError') return
      error.value = e?.message || '搜索失败'
    } finally {
      loading.value = false
    }
  }

  function clearAll(): void {
    q.value = ''
    genres.value = []
    regions.value = []
    yearGte.value = undefined
    yearLte.value = undefined
    ratingGte.value = undefined
    ratingLte.value = undefined
    sort.value = 'relevance_desc'
    page.value = 1
  }

  // watch route -> state
  watch(() => route.fullPath, () => {
    syncFromRoute()
    runSearch()
  }, { immediate: true })

  // public API
  return {
    // state
    q, genres, regions, yearGte, yearLte, ratingGte, ratingLte, sort, page, pageSize,
    items, total, hasMore, facets, loading, error,
    // computed
    params,
    // actions
    syncFromRoute,
    syncToRoute,
    runSearch,
    clearAll
  }
})


