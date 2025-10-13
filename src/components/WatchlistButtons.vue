<template>
  <div class="watchlist-buttons">
    <button :class="['wbtn', {active: modelValue==='want'}]" @click="toggle('want')"><i class="icon-bookmark"></i> 想看</button>
    <button :class="['wbtn', {active: modelValue==='watching'}]" @click="toggle('watching')"><i class="icon-play"></i> 在看</button>
    <button :class="['wbtn', {active: modelValue==='watched'}]" @click="toggle('watched')"><i class="icon-check"></i> 看过</button>
  </div>
</template>

<script setup lang="ts">
import type { WatchStatus } from '@/types/library'
const props = defineProps<{ modelValue?: WatchStatus }>()
const emit = defineEmits<{ (e:'update:modelValue', v:WatchStatus|undefined):void }>()

function toggle(next: WatchStatus){
  emit('update:modelValue', props.modelValue === next ? undefined : next)
}
</script>

<style scoped>
.watchlist-buttons{ display:flex; gap:6px; flex-wrap:wrap; }
.wbtn{ border:1px solid #e5e7eb; background:#fff; border-radius:8px; padding:6px 10px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; }
.wbtn.active{ border-color: var(--primary-color); color: var(--primary-color); background: var(--bg-primary); }
</style>


