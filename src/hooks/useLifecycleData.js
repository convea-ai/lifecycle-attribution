import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

const API_BASE = '/api/lifecycle'

// Mock data generator functions for development
const generateMockData = {
  sankey: () => [
    { source: 'Google Ads', target: 'Product View', value: 1200 },
    { source: 'Meta', target: 'Product View', value: 800 },
    { source: 'Email', target: 'Product View', value: 400 },
    { source: 'Product View', target: 'Add to Cart', value: 1000 },
    { source: 'Product View', target: 'Exit', value: 1400 },
    { source: 'Add to Cart', target: 'Checkout', value: 600 },
    { source: 'Add to Cart', target: 'Exit', value: 400 },
    { source: 'Checkout', target: 'Purchase', value: 480 },
    { source: 'Checkout', target: 'Exit', value: 120 },
  ],
  
  assistedRevenue: () => [
    { channel: 'Google Ads', assistedRevenue: 125000, lastClickRevenue: 85000 },
    { channel: 'Meta', assistedRevenue: 98000, lastClickRevenue: 72000 },
    { channel: 'Email', assistedRevenue: 45000, lastClickRevenue: 38000 },
    { channel: 'Organic', assistedRevenue: 67000, lastClickRevenue: 89000 },
    { channel: 'TikTok', assistedRevenue: 34000, lastClickRevenue: 23000 },
  ],
  
  holdoutLift: () => [
    { campaign: 'Black Friday Email', exposedRevenue: 45000, holdoutRevenue: 32000, lift: 40.6 },
    { campaign: 'Google Search Brand', exposedRevenue: 128000, holdoutRevenue: 98000, lift: 30.6 },
    { campaign: 'Meta Retargeting', exposedRevenue: 67000, holdoutRevenue: 56000, lift: 19.6 },
    { campaign: 'TikTok Creative Test', exposedRevenue: 23000, holdoutRevenue: 21000, lift: 9.5 },
  ],
  
  incrementalityScoreboard: () => [
    { channel: 'Email Campaigns', liftPerDollar: 4.2, spend: 12000, incrementalRevenue: 50400 },
    { channel: 'Google Search', liftPerDollar: 3.1, spend: 45000, incrementalRevenue: 139500 },
    { channel: 'Meta Lookalike', liftPerDollar: 2.8, spend: 28000, incrementalRevenue: 78400 },
    { channel: 'TikTok Ads', liftPerDollar: 1.9, spend: 15000, incrementalRevenue: 28500 },
    { channel: 'Display Retargeting', liftPerDollar: 0.8, spend: 18000, incrementalRevenue: 14400 },
  ],
  
  funnelMetrics: () => [
    { stage: 'Visitors', users: 10000, conversionRate: 100, timeOnPage: 45, scrollDepth: 0.65 },
    { stage: 'Product Views', users: 6500, conversionRate: 65, timeOnPage: 78, scrollDepth: 0.82 },
    { stage: 'Add to Cart', users: 2600, conversionRate: 26, timeOnPage: 120, scrollDepth: 0.91 },
    { stage: 'Checkout Started', users: 1560, conversionRate: 15.6, timeOnPage: 240, scrollDepth: 0.95 },
    { stage: 'Purchase', users: 936, conversionRate: 9.36, timeOnPage: 180, scrollDepth: 1.0 },
  ],
  
  behaviorConversion: () => 
    Array.from({ length: 50 }, (_, i) => ({
      behaviorMetric: Math.random() * 100,
      conversionProbability: Math.random() * 100,
      sessions: Math.floor(Math.random() * 1000) + 100,
    })),
  
  ltvBySource: () => {
    const sources = ['Google Ads', 'Meta', 'Email', 'Organic', 'TikTok']
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - 29 + i)
      return format(date, 'yyyy-MM-dd')
    })
    
    return sources.flatMap(source => 
      dates.map(date => ({
        date,
        source,
        LTV30: Math.random() * 50 + 20,
        LTV60: Math.random() * 80 + 40,
        LTV90: Math.random() * 120 + 70,
      }))
    )
  },
  
  productLTVMatrix: () => {
    const products = ['Skincare Set', 'Hair Care', 'Makeup Kit', 'Body Care', 'Supplements']
    const buckets = ['$0-50', '$50-100', '$100-200', '$200-500', '$500+']
    
    return products.flatMap(product =>
      buckets.map(bucket => ({
        firstProduct: product,
        LTVBucket: bucket,
        count: Math.floor(Math.random() * 500) + 50,
      }))
    )
  },
  
  churnRisk: () => {
    const segments = ['New', 'Returning', 'VIP', 'At Risk', 'Churned']
    const recencyBuckets = ['0-7 days', '8-30 days', '31-60 days', '61-90 days', '90+ days']
    
    return segments.flatMap(segment =>
      recencyBuckets.map(recency => ({
        segment,
        recency,
        riskScore: Math.random() * 100,
        customers: Math.floor(Math.random() * 1000) + 100,
      }))
    )
  },
  
  repeatRateForecast: () => 
    Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - 11 + i)
      return {
        cohortMonth: format(date, 'yyyy-MM'),
        actualRate2nd: Math.random() * 30 + 15,
        forecastRate2nd: Math.random() * 35 + 18,
        customers: Math.floor(Math.random() * 2000) + 500,
      }
    }),
}

const fetchLifecycleData = async (endpoint, params) => {
  // In development, return mock data
  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    const mockDataKey = endpoint.split('/').pop()
    return generateMockData[mockDataKey]?.() || []
  }
  
  // In production, make actual API calls
  const searchParams = new URLSearchParams(params)
  const response = await fetch(`${API_BASE}/${endpoint}?${searchParams}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`)
  }
  
  return response.json()
}

export const useLifecycleData = (filters) => {
  const queryParams = {
    startDate: filters.dateRange.from ? format(filters.dateRange.from, 'yyyy-MM-dd') : '',
    endDate: filters.dateRange.to ? format(filters.dateRange.to, 'yyyy-MM-dd') : '',
    channels: filters.selectedChannels.join(','),
    segment: filters.selectedSegment,
  }

  const sankeyQuery = useQuery({
    queryKey: ['lifecycle', 'sankey', queryParams],
    queryFn: () => fetchLifecycleData('sankey', queryParams),
  })

  const assistedRevenueQuery = useQuery({
    queryKey: ['lifecycle', 'assistedRevenue', queryParams],
    queryFn: () => fetchLifecycleData('assistedRevenue', queryParams),
  })

  const holdoutLiftQuery = useQuery({
    queryKey: ['lifecycle', 'holdoutLift', queryParams],
    queryFn: () => fetchLifecycleData('holdoutLift', queryParams),
  })

  const incrementalityQuery = useQuery({
    queryKey: ['lifecycle', 'incrementalityScoreboard', queryParams],
    queryFn: () => fetchLifecycleData('incrementalityScoreboard', queryParams),
  })

  const funnelQuery = useQuery({
    queryKey: ['lifecycle', 'funnelMetrics', queryParams],
    queryFn: () => fetchLifecycleData('funnelMetrics', queryParams),
  })

  const behaviorConversionQuery = useQuery({
    queryKey: ['lifecycle', 'behaviorConversion', queryParams],
    queryFn: () => fetchLifecycleData('behaviorConversion', queryParams),
  })

  const ltvBySourceQuery = useQuery({
    queryKey: ['lifecycle', 'ltvBySource', queryParams],
    queryFn: () => fetchLifecycleData('ltvBySource', queryParams),
  })

  const productLTVQuery = useQuery({
    queryKey: ['lifecycle', 'productLTVMatrix', queryParams],
    queryFn: () => fetchLifecycleData('productLTVMatrix', queryParams),
  })

  const churnRiskQuery = useQuery({
    queryKey: ['lifecycle', 'churnRisk', queryParams],
    queryFn: () => fetchLifecycleData('churnRisk', queryParams),
  })

  const repeatRateQuery = useQuery({
    queryKey: ['lifecycle', 'repeatRateForecast', queryParams],
    queryFn: () => fetchLifecycleData('repeatRateForecast', queryParams),
  })

  return {
    sankey: sankeyQuery,
    assistedRevenue: assistedRevenueQuery,
    holdoutLift: holdoutLiftQuery,
    incrementality: incrementalityQuery,
    funnel: funnelQuery,
    behaviorConversion: behaviorConversionQuery,
    ltvBySource: ltvBySourceQuery,
    productLTV: productLTVQuery,
    churnRisk: churnRiskQuery,
    repeatRate: repeatRateQuery,
    
    // Aggregate loading and error states
    isLoading: [
      sankeyQuery, assistedRevenueQuery, holdoutLiftQuery, incrementalityQuery,
      funnelQuery, behaviorConversionQuery, ltvBySourceQuery, productLTVQuery,
      churnRiskQuery, repeatRateQuery
    ].some(query => query.isLoading),
    
    isError: [
      sankeyQuery, assistedRevenueQuery, holdoutLiftQuery, incrementalityQuery,
      funnelQuery, behaviorConversionQuery, ltvBySourceQuery, productLTVQuery,
      churnRiskQuery, repeatRateQuery
    ].some(query => query.isError),
  }
} 