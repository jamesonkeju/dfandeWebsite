import { api } from "@/app/api";

export interface TrackVisitPayload {
  sessionId: string;
  path: string;
  queryString?: string;
  referrer?: string;
  durationSeconds?: number;
}

export interface TrendDataPoint {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
}

export interface TopPageMetric {
  path: string;
  views: number;
  uniqueVisitors: number;
  percentage: number;
}

export interface BreakdownItem {
  name: string;
  count: number;
  percentage: number;
}

export interface VisitorLogItem {
  id: string;
  path: string;
  referrer?: string;
  browser: string;
  operatingSystem: string;
  deviceType: string;
  durationSeconds: number;
  timestampUtc: string;
}

export interface AnalyticsSummaryResponse {
  totalPageViews: number;
  totalUniqueVisitors: number;
  todayPageViews: number;
  todayUniqueVisitors: number;
  last7DaysViews: number;
  last30DaysViews: number;
  avgDurationSeconds: number;
  trafficTrends: TrendDataPoint[];
  topPages: TopPageMetric[];
  deviceBreakdown: BreakdownItem[];
  browserBreakdown: BreakdownItem[];
  referrerBreakdown: BreakdownItem[];
  recentVisits: VisitorLogItem[];
}

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    trackVisit: builder.mutation<{ id: string }, TrackVisitPayload>({
      query: (payload) => ({
        url: "/analytics/track",
        method: "POST",
        body: payload,
      }),
    }),

    getAnalyticsSummary: builder.query<AnalyticsSummaryResponse, number | void>({
      query: (days = 30) => `/analytics/summary?days=${days || 30}`,
      transformResponse: (response: { data: AnalyticsSummaryResponse }) => response.data,
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useTrackVisitMutation, useGetAnalyticsSummaryQuery } = analyticsApi;
