import type { RouteRecordRaw } from 'vue-router'

export interface RouteParams {
  id?: string;
  category?: string;
}

export type AppRouteRecord = RouteRecordRaw & {
  props?: boolean | Record<string, any> | ((to: any) => Record<string, any>);
}
