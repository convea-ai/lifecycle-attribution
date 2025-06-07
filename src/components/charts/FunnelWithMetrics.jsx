import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatNumber, formatPercentage } from '@/lib/utils'

export const FunnelWithMetrics = ({ data, onAction }) => {
  const handleBarClick = (data, index) => {
    if (data && data.activePayload) {
      const clickedData = data.activePayload[0].payload
      const cohort = {
        type: 'funnel_stage',
        stage: clickedData.stage,
        users: clickedData.users,
        conversionRate: clickedData.conversionRate,
        timeOnPage: clickedData.timeOnPage,
        scrollDepth: clickedData.scrollDepth,
        description: `${clickedData.stage} stage optimization cohort`
      }
      onAction(cohort)
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">
              Users: {formatNumber(data.users)}
            </p>
            <p className="text-green-600">
              Conversion Rate: {data.conversionRate}%
            </p>
            <p className="text-purple-600">
              Avg. Time on Page: {data.timeOnPage}s
            </p>
            <p className="text-orange-600">
              Scroll Depth: {formatPercentage(data.scrollDepth * 100)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const getFunnelColor = (index, total) => {
    const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
    return colors[index % colors.length]
  }

  const insight = "Major drop-off at 'Add to Cart' stage (60% loss). Users spend 120s on this page but only 91% scroll depth suggests UI issues."
  const recommendation = "A/B test simplified checkout flow and move key product info above the fold. Add urgency elements to reduce decision time."
  const impact = "Reducing cart abandonment by 15% could increase monthly revenue by +$156K with current traffic levels."

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Activation Funnel Analysis</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Insight:</strong> {insight}<br/>
          <strong>Recommendation:</strong> {recommendation}<br/>
          <strong>Impact:</strong> {impact}
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          onClick={handleBarClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="stage" 
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tickFormatter={formatNumber}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Users', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="users"
            radius={[4, 4, 0, 0]}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getFunnelColor(index, data.length)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Metrics overlay */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((stage, index) => (
          <div key={stage.stage} className="bg-muted/50 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-2" style={{ color: getFunnelColor(index, data.length) }}>
              {stage.stage}
            </h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Conv. Rate: {stage.conversionRate}%</p>
              <p>Time: {stage.timeOnPage}s</p>
              <p>Scroll: {Math.round(stage.scrollDepth * 100)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 