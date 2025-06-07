import { useState } from 'react'
import { Calendar, Filter, User, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

const DateRangePicker = ({ dateRange, onDateRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) return 'Select dates'
    return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-[240px] justify-start text-left font-normal"
      >
        <Calendar className="mr-2 h-4 w-4" />
        {formatDateRange()}
      </Button>
      {/* Note: In a real implementation, you'd integrate with a proper date picker library */}
    </div>
  )
}

const ChannelMultiSelect = ({ 
  selectedChannels, 
  availableChannels, 
  onToggleChannel, 
  onSelectAll, 
  onClearAll 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-[200px] justify-start text-left font-normal"
      >
        <Filter className="mr-2 h-4 w-4" />
        {selectedChannels.length === 0 
          ? 'No channels' 
          : selectedChannels.length === availableChannels.length
          ? 'All channels'
          : `${selectedChannels.length} channels`
        }
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[300px] p-4 bg-popover border border-border rounded-lg shadow-lg z-50">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium">Select Channels</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-accent rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex gap-2 mb-3">
            <Button size="sm" variant="outline" onClick={onSelectAll}>
              Select All
            </Button>
            <Button size="sm" variant="outline" onClick={onClearAll}>
              Clear All
            </Button>
          </div>

          <div className="space-y-2">
            {availableChannels.map((channel) => (
              <label
                key={channel}
                className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedChannels.includes(channel)}
                  onChange={() => onToggleChannel(channel)}
                  className="rounded border-border"
                />
                <span className="text-sm">{channel}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const SegmentSelector = ({ selectedSegment, availableSegments, onSegmentChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-[180px] justify-start text-left font-normal"
      >
        <User className="mr-2 h-4 w-4" />
        {selectedSegment}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[200px] p-2 bg-popover border border-border rounded-lg shadow-lg z-50">
          {availableSegments.map((segment) => (
            <button
              key={segment}
              onClick={() => {
                onSegmentChange(segment)
                setIsOpen(false)
              }}
              className={cn(
                "block w-full text-left px-3 py-2 text-sm rounded hover:bg-accent",
                selectedSegment === segment && "bg-accent"
              )}
            >
              {segment}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export const Header = ({ filters, onFiltersChange }) => {
  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-bold text-card-foreground">
          Lifecycle Attribution Dashboard
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Date Range Picker */}
        <DateRangePicker
          dateRange={filters.dateRange}
          onDateRangeChange={onFiltersChange.updateDateRange}
        />

        {/* Channel Multi-Select */}
        <ChannelMultiSelect
          selectedChannels={filters.selectedChannels}
          availableChannels={filters.availableChannels}
          onToggleChannel={onFiltersChange.toggleChannel}
          onSelectAll={onFiltersChange.selectAllChannels}
          onClearAll={onFiltersChange.clearChannels}
        />

        {/* Segment Selector */}
        <SegmentSelector
          selectedSegment={filters.selectedSegment}
          availableSegments={filters.availableSegments}
          onSegmentChange={onFiltersChange.updateSegment}
        />

        {/* Reset Button */}
        {filters.hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFiltersChange.resetFilters}
            className="text-muted-foreground"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}

        {/* User Menu */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  )
} 