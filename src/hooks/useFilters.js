import { useState, useCallback } from 'react'
import { subDays, startOfDay, endOfDay } from 'date-fns'

const DEFAULT_CHANNELS = ['Google Ads', 'Meta', 'Email', 'Organic', 'TikTok', 'Influencers']
const DEFAULT_SEGMENTS = ['All', 'New Customers', 'Returning Customers', 'High Value', 'At Risk']

export const useFilters = () => {
  const [dateRange, setDateRange] = useState({
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date())
  })
  
  const [selectedChannels, setSelectedChannels] = useState(DEFAULT_CHANNELS)
  const [selectedSegment, setSelectedSegment] = useState('All')

  const updateDateRange = useCallback((newRange) => {
    setDateRange(newRange)
  }, [])

  const toggleChannel = useCallback((channel) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    )
  }, [])

  const selectAllChannels = useCallback(() => {
    setSelectedChannels(DEFAULT_CHANNELS)
  }, [])

  const clearChannels = useCallback(() => {
    setSelectedChannels([])
  }, [])

  const updateSegment = useCallback((segment) => {
    setSelectedSegment(segment)
  }, [])

  const resetFilters = useCallback(() => {
    setDateRange({
      from: startOfDay(subDays(new Date(), 30)),
      to: endOfDay(new Date())
    })
    setSelectedChannels(DEFAULT_CHANNELS)
    setSelectedSegment('All')
  }, [])

  return {
    // State
    dateRange,
    selectedChannels,
    selectedSegment,
    
    // Available options
    availableChannels: DEFAULT_CHANNELS,
    availableSegments: DEFAULT_SEGMENTS,
    
    // Actions
    updateDateRange,
    toggleChannel,
    selectAllChannels,
    clearChannels,
    updateSegment,
    resetFilters,
    
    // Computed
    hasActiveFilters: selectedChannels.length !== DEFAULT_CHANNELS.length || selectedSegment !== 'All'
  }
} 