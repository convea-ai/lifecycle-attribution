import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

export const IncrementalityScoreboard = ({ data, onAction }) => {
  // Sort data by lift per dollar (descending)
  const sortedData = [...data].sort((a, b) => b.liftPerDollar - a.liftPerDollar)

  const handleBarClick = (data, index) => {
    if (data && data.activePayload) {
      const clickedData = data.activePayload[0].payload
      const position = sortedData.findIndex(item => item.channel === clickedData.channel) + 1
      const isTopPerformer = position <= 3
      const isBottomPerformer = position > sortedData.length - 3

      const cohort = {
        type: 'incrementality_cohort',
        channel: clickedData.channel,
        liftPerDollar: clickedData.liftPerDollar,
        spend: clickedData.spend,
        incrementalRevenue: clickedData.incrementalRevenue,
        position,
        action: isTopPerformer ? 'scale' : isBottomPerformer ? 'retest' : 'optimize',
        description: `${clickedData.channel} - ${isTopPerformer ? 'Top performer to scale' : isBottomPerformer ? 'Needs retesting' : 'Optimization candidate'}`
      }
      onAction(cohort)
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const roas = (data.incrementalRevenue / data.spend).toFixed(2)
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <p className="text-green-600 font-bold">
            Lift per $: ${data.liftPerDollar.toFixed(2)}
          </p>
          <p className="text-blue-600">
            Spend: {formatCurrency(data.spend)}
          </p>
          <p className="text-purple-600">
            Incremental Revenue: {formatCurrency(data.incrementalRevenue)}
          </p>
          <p className="text-orange-600">
            ROAS: {roas}x
          </p>
        </div>
      )
    }
    return null
  }

  const getBarColor = (value, index) => {
    const maxValue = Math.max(...sortedData.map(d => d.liftPerDollar))
    const minValue = Math.min(...sortedData.map(d => d.liftPerDollar))
    const position = index + 1

    // Top 3 performers - green shades
    if (position <= 3) {
      return '#10b981'
    }
    // Bottom 3 performers - red shades  
    if (position > sortedData.length - 3) {
      return '#ef4444'
    }
    // Middle performers - blue
    return '#3b82f6'
  }

  const insight = "Email Campaigns deliver 4.2x lift per dollar, outperforming all paid channels. Display Retargeting shows concerning 0.8x efficiency."
  const recommendation = "Reallocate 30% of Display budget to Email and Google Search. Conduct creative tests for underperforming TikTok campaigns."
  const impact = "Budget reallocation could improve overall ROAS by 23% and generate +$67K additional incremental revenue monthly."

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Incrementality Performance Ranking</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Insight:</strong> {insight}<br/>
          <strong>Recommendation:</strong> {recommendation}<br/>
          <strong>Impact:</strong> {impact}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onClick={handleBarClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="channel" 
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Lift per Dollar Spent', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="liftPerDollar"
            fill={(entry, index) => getBarColor(entry, index)}
            radius={[4, 4, 0, 0]}
            style={{ cursor: 'pointer' }}
          >
            {sortedData.map((entry, index) => (
              <Bar key={entry.channel} fill={getBarColor(entry.liftPerDollar, index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span>Top Performers (Scale)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>Mid Performers (Optimize)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
          <span>Low Performers (Retest)</span>
        </div>
      </div>
    </div>
  )
} 