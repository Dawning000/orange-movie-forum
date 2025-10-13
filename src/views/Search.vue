<template>
  <div class="search-page">
    <div class="search-header">
      <input
        v-model="store.q"
        @keyup.enter="applySearch"
        class="search-input"
        type="text"
        placeholder="搜索电影、剧集、动漫、人物或标签"
      />
      <button class="search-btn" @click="applySearch">
        <i class="icon-search"></i>
        搜索
      </button>
    </div>

    <div class="search-body">
      <aside class="facet-panel">
        <section class="facet-section">
          <h4>类型</h4>
          <div class="chips">
            <button
              v-for="g in (store.facets?.genres || [])"
              :key="g.value"
              :class="['chip', { active: store.genres.includes(g.value) }]"
              @click="toggleArray(store.genres, g.value)"
            >{{ g.value }}<span class="count">{{ g.count }}</span></button>
          </div>
        </section>

        <section class="facet-section">
          <h4>地区</h4>
          <div class="chips">
            <button
              v-for="r in (store.facets?.regions || [])"
              :key="r.value"
              :class="['chip', { active: store.regions.includes(r.value) }]"
              @click="toggleArray(store.regions, r.value)"
            >{{ r.value }}<span class="count">{{ r.count }}</span></button>
          </div>
        </section>

        <section class="facet-section">
          <h4>筛选</h4>
          <div class="range-row">
            <label>年份 ≥</label>
            <input type="number" v-model.number="store.yearGte" placeholder="如 2018" />
          </div>
          <div class="range-row">
            <label>评分 ≥</label>
            <input type="number" step="0.1" v-model.number="store.ratingGte" placeholder="如 7" />
          </div>
          <button class="apply-btn" @click="applySearch(true)">应用筛选</button>
          <button class="clear-btn" @click="clearAll">清空</button>
        </section>
      </aside>

      <section class="result-panel">
        <div class="result-header">
          <div class="result-count">共 {{ store.total }} 条结果</div>
          <select v-model="store.sort" @change="applySearch(true)">
            <option value="relevance_desc">相关度</option>
            <option value="hot_desc">热度</option>
            <option value="rating_desc">评分</option>
            <option value="year_desc">年份</option>
            <option value="updated_desc">更新时间</option>
          </select>
        </div>

        <div v-if="store.loading" class="grid">
          <div v-for="n in 12" :key="n" class="card skeleton"></div>
        </div>

        <div v-else-if="store.items.length" class="grid">
          <article v-for="it in store.items" :key="it.id" class="card">
            <div class="poster" :style="{ backgroundImage: it.poster ? `url(${it.poster})` : undefined }"></div>
            <div class="meta">
              <h3 v-html="it.highlight?.title || it.title"></h3>
              <p class="sub">{{ it.year || '-' }} · {{ it.rating ?? '-' }}</p>
              <div class="tags">
                <span v-for="g in (it.genres || [])" :key="g" class="tag">{{ g }}</span>
              </div>
              <div class="actions">
                <WatchlistButtons v-model="getEntry(it).status" @update:modelValue="v=>updateStatus(it,v)" />
                <RatingStars :tooltip-base="'我的评分'" v-model="getEntry(it).rating" @update:modelValue="v=>updateRating(it,v)" />
              </div>
            </div>
          </article>
        </div>

        <div v-else class="empty">
          <p>没有找到结果，试试放宽筛选或更换关键词。</p>
          <div class="suggestions">
            <span v-for="s in (store.facets?.genres || []).slice(0,6)" :key="s.value" class="suggest" @click="quickGenre(s.value)">{{ s.value }}</span>
          </div>
        </div>

        <div class="pager" v-if="store.total > store.pageSize">
          <button :disabled="store.page<=1" @click="changePage(store.page-1)">上一页</button>
          <span>第 {{ store.page }} 页</span>
          <button :disabled="!store.hasMore" @click="changePage(store.page+1)">下一页</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '@/stores/search'
import { useLibraryStore } from '@/stores/library'
import WatchlistButtons from '@/components/WatchlistButtons.vue'
import RatingStars from '@/components/RatingStars.vue'
import { nextTick } from 'vue'
const store = useSearchStore()
const library = useLibraryStore()

function toggleArray(arrRef, value) {
  const idx = arrRef.indexOf(value)
  if (idx >= 0) arrRef.splice(idx, 1)
  else arrRef.push(value)
  applySearch(true)
}

async function applySearch(replace = false) {
  store.page = 1
  await store.syncToRoute(replace)
}

function clearAll() {
  store.clearAll()
  applySearch(true)
}

function quickGenre(value) {
  if (!store.genres.includes(value)) store.genres.push(value)
  applySearch(true)
}

function changePage(p) {
  store.page = p
  store.syncToRoute(true)
}

// ensure initial sync when view mounts
nextTick(() => {
  store.syncFromRoute()
})

function getEntry(it:any){
  const existing = library.entries[it.id]
  if (existing) return existing
  return library.upsertEntry({
    mediaId: it.id,
    mediaType: 'movie',
    title: it.title,
    poster: it.poster,
    year: it.year
  })
}

function updateStatus(it:any, v:any){
  library.setStatus(it.id, v)
}

function updateRating(it:any, v:any){
  library.setRating(it.id, v as number|undefined)
}
</script>

<style lang="scss" scoped>
.search-page {
  padding: 24px;
}
.search-header {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  .search-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
  .search-btn {
    padding: 10px 14px;
    border: none;
    background: var(--primary-color);
    color: #fff;
    border-radius: 8px;
    cursor: pointer;
  }
}
.search-body {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
}
.facet-panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  .facet-section { 
    & + .facet-section { margin-top: 12px; }
    h4 { margin: 0 0 8px 0; font-size: 13px; color: #6b7280; }
  }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip { 
    padding: 6px 10px; border-radius: 16px; border: 1px solid #e5e7eb; background: #f8fafc; cursor: pointer; font-size: 12px;
    &.active { background: var(--bg-primary); color: var(--primary-color); border-color: var(--primary-color); }
    .count { margin-left: 6px; color: #9ca3af; }
  }
  .range-row { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
  .apply-btn { width: 100%; padding: 8px 10px; border: none; background: var(--primary-color); color: #fff; border-radius: 8px; cursor: pointer; }
  .clear-btn { width: 100%; margin-top: 6px; padding: 8px 10px; border: 1px solid #e5e7eb; background: #fff; border-radius: 8px; cursor: pointer; }
}
.result-panel {
  .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
  .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
  .card .poster { height: 180px; background-color: #f3f4f6; background-size: cover; background-position: center; }
  .card .meta { padding: 10px; }
  .card .meta h3 { margin: 0; font-size: 14px; }
  .card .meta .sub { margin: 6px 0; color: #6b7280; font-size: 12px; }
  .card .meta .tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .card .meta .tag { padding: 2px 6px; background: #f3f4f6; border-radius: 6px; font-size: 11px; }
  .card .meta .actions { margin-top: 8px; display: flex; align-items: center; justify-content: space-between; }
  .skeleton { height: 240px; background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%); background-size: 400% 100%; animation: shimmer 1.4s ease infinite; border-radius: 12px; }
}
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
</style>


