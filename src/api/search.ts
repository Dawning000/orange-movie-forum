import type { SearchQueryParams, SearchResponse, SuggestItem } from '@/types/search'

const API_BASE = '/api'

function buildQuery(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      if (value.length > 0) searchParams.set(key, value.join(','))
    } else {
      searchParams.set(key, String(value))
    }
  })

  return searchParams.toString()
}

export async function search(params: SearchQueryParams, signal?: AbortSignal): Promise<SearchResponse> {
  const query = buildQuery({
    q: params.q,
    genres: params.genres,
    regions: params.regions,
    year_gte: params.yearGte,
    year_lte: params.yearLte,
    rating_gte: params.ratingGte,
    rating_lte: params.ratingLte,
    sort: params.sort,
    page: params.page,
    page_size: params.pageSize
  })

  const res = await fetch(`${API_BASE}/search?${query}`, { signal })
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  return res.json() as Promise<SearchResponse>
}

export async function suggest(q: string, signal?: AbortSignal): Promise<SuggestItem[]> {
  const query = new URLSearchParams({ q })
  const res = await fetch(`${API_BASE}/suggest?${query.toString()}`, { signal })
  if (!res.ok) throw new Error(`Suggest failed: ${res.status}`)
  return res.json() as Promise<SuggestItem[]>
}


