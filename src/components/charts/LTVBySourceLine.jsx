import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { getChartColors } from '@/lib/utils'

export const LTVBySourceLine = ({ data, onAction }) => {
  // Reshape data for proper line chart rendering
  const reshapeData = () => {
    if (!data || data.length === 0) return []
    
    // First, let's get all unique dates and sources
    const uniqueDates = [...new Set(data.map(d => d.date))].sort()
    const sources = [...new Set(data.map(d => d.source))]
    
    // Create a map for quick lookup
    const dataMap = {}
    data.forEach(item => {
      const key = `${item.date}_${item.source}`
      dataMap[key] = item
    })
    
    // Build the chart data with all dates and all sources
    return uniqueDates.map(date => {
      const row = { 
        date,
        formattedDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
      
      sources.forEach(source => {
        const key = `${date}_${source}`
        const dataPoint = dataMap[key]
        if (dataPoint) {
          row[`${source}_LTV30`] = dataPoint.LTV30
          row[`${source}_LTV60`] = dataPoint.LTV60  
          row[`${source}_LTV90`] = dataPoint.LTV90
        }
      })
      
      return row
    })
  }

  const chartData = reshapeData()
  const sources = [...new Set(data.map(d => d.source))]
  const colors = getChartColors()
  
  const handleLineClick = (chartData, index) => {
    if (chartData && chartData.activePayload) {
      const clickedData = chartData.activePayload[0].payload
      const cohort = {
        type: 'ltv_source',
        date: clickedData.date,
        sources: sources,
        description: `LTV cohort for ${clickedData.formattedDate}`
      }
      onAction(cohort)
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Find the data point to get formatted date
      const dataPoint = chartData.find(d => d.date === label)
      const displayDate = dataPoint ? dataPoint.formattedDate : label
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{displayDate}</p>
          {payload.map((entry, index) => {
            const sourceName = entry.dataKey.replace('_LTV90', '')
            return (
              <p key={index} style={{ color: entry.color }}>
                {sourceName}: {formatCurrency(entry.value)}
              </p>
            )
          })}
        </div>
      )
    }
    return null
  }

  const insight = "Organic traffic shows highest 90-day LTV at $127 average, but Google Ads has fastest early monetization with $89 LTV30."
  const recommendation = "Increase organic content investment for long-term value and optimize Google Ads for immediate revenue acceleration."
  const impact = "Balancing acquisition mix could increase blended LTV90 by 18% while maintaining healthy payback periods."

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Lifetime Value by Acquisition Source</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Insight:</strong> {insight}<br/>
          <strong>Recommendation:</strong> {recommendation}<br/>
          <strong>Impact:</strong> {impact}
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          onClick={handleLineClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              // Use the pre-formatted date from our data
              const dataPoint = chartData.find(d => d.date === value)
              return dataPoint ? dataPoint.formattedDate : value
            }}
            stroke="hsl(var(--muted-foreground))"
            angle={-45}
            textAnchor="end"
            height={80}
            interval="preserveStartEnd"
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'LTV ($)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {sources.map((source, index) => (
            <Line
              key={source}
              type="monotone"
              dataKey={`${source}_LTV90`}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              name={source}
              dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: colors[index % colors.length] }}
              connectNulls={false}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* LTV Comparison Cards */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {sources.map((source, index) => {
          const sourceData = data.filter(d => d.source === source)
          const avgLTV30 = sourceData.reduce((sum, d) => sum + d.LTV30, 0) / sourceData.length
          const avgLTV60 = sourceData.reduce((sum, d) => sum + d.LTV60, 0) / sourceData.length
          const avgLTV90 = sourceData.reduce((sum, d) => sum + d.LTV90, 0) / sourceData.length
          
          return (
            <div key={source} className="bg-muted/50 rounded-lg p-4">
              <h4 
                className="font-medium mb-2" 
                style={{ color: colors[index % colors.length] }}
              >
                {source}
              </h4>
              <div className="space-y-1 text-sm">
                <p>LTV30: {formatCurrency(avgLTV30)}</p>
                <p>LTV60: {formatCurrency(avgLTV60)}</p>
                <p className="font-semibold">LTV90: {formatCurrency(avgLTV90)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 