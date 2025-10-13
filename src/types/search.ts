export interface SearchQueryParams {
  q?: string;
  genres?: string[];
  regions?: string[];
  yearGte?: number;
  yearLte?: number;
  ratingGte?: number;
  ratingLte?: number;
  sort?: 'relevance_desc' | 'hot_desc' | 'rating_desc' | 'year_desc' | 'updated_desc';
  page?: number;
  pageSize?: number;
}

export interface SearchItem {
  id: number | string;
  title: string;
  year?: number;
  rating?: number;
  regions?: string[];
  genres?: string[];
  poster?: string;
  highlight?: Record<string, string>;
}

export interface FacetBucket {
  value: string;
  count: number;
}

export interface SearchFacets {
  genres?: FacetBucket[];
  regions?: FacetBucket[];
  yearRanges?: FacetBucket[];
  ratingRanges?: FacetBucket[];
}

export interface SearchResponse {
  items: SearchItem[];
  facets?: SearchFacets;
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  suggestions?: string[];
}

export type SuggestItemType = 'movie' | 'tv' | 'anime' | 'person' | 'tag' | 'list';

export interface SuggestItem {
  type: SuggestItemType;
  text: string;
  id?: number | string;
}

