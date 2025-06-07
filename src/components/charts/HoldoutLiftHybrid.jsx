import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency, formatPercentage } from '@/lib/utils'

export const HoldoutLiftHybrid = ({ data, onAction }) => {
  const handleClick = (data, index) => {
    if (data && data.activePayload) {
      const clickedData = data.activePayload[0].payload
      const cohort = {
        type: 'holdout_campaign',
        campaign: clickedData.campaign,
        exposedRevenue: clickedData.exposedRevenue,
        holdoutRevenue: clickedData.holdoutRevenue,
        lift: clickedData.lift,
        incrementalRevenue: clickedData.exposedRevenue - clickedData.holdoutRevenue,
        description: `${clickedData.campaign} holdout test cohort`
      }
      onAction(cohort)
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const incrementalRevenue = data.exposedRevenue - data.holdoutRevenue
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <p className="text-blue-600">
            Exposed Revenue: {formatCurrency(data.exposedRevenue)}
          </p>
          <p className="text-gray-600">
            Holdout Revenue: {formatCurrency(data.holdoutRevenue)}
          </p>
          <p className="text-green-600 font-medium">
            Incremental: {formatCurrency(incrementalRevenue)}
          </p>
          <p className="text-purple-600 font-medium">
            Lift: {data.lift.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  const insight = "Black Friday Email campaign shows exceptional 40.6% lift, significantly outperforming other campaigns in true incrementality."
  const recommendation = "Scale the Black Friday Email creative and audience strategy to other seasonal campaigns and high-value segments."
  const impact = "Scaling this approach could generate an additional +$89K in truly incremental revenue per quarter."

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Holdout Test Results</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Insight:</strong> {insight}<br/>
          <strong>Recommendation:</strong> {recommendation}<br/>
          <strong>Impact:</strong> {impact}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onClick={handleClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="campaign" 
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            yAxisId="revenue"
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            yAxisId="lift"
            orientation="right"
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            yAxisId="revenue"
            dataKey="exposedRevenue" 
            fill="#3b82f6" 
            name="Exposed Revenue"
            radius={[2, 2, 0, 0]}
            style={{ cursor: 'pointer' }}
          />
          <Bar 
            yAxisId="revenue"
            dataKey="holdoutRevenue" 
            fill="#94a3b8" 
            name="Holdout Revenue"
            radius={[2, 2, 0, 0]}
            style={{ cursor: 'pointer' }}
          />
          <Line 
            yAxisId="lift"
            type="monotone" 
            dataKey="lift" 
            stroke="#f59e0b" 
            strokeWidth={3}
            name="Lift %"
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#f59e0b' }}
            style={{ cursor: 'pointer' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
} 