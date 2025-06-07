import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

export const AssistedRevenueBar = ({ data, onAction }) => {
  const handleBarClick = (data, index) => {
    if (data && data.activePayload) {
      const clickedData = data.activePayload[0].payload
      const cohort = {
        type: 'assisted_channel',
        channel: clickedData.channel,
        assistedRevenue: clickedData.assistedRevenue,
        lastClickRevenue: clickedData.lastClickRevenue,
        users: Math.floor(clickedData.assistedRevenue / 45), // Estimated users
        description: `${clickedData.channel} assisted revenue cohort`
      }
      onAction(cohort)
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const lift = ((data.assistedRevenue - data.lastClickRevenue) / data.lastClickRevenue * 100).toFixed(1)
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <div className="space-y-1 text-sm">
            <p className="font-semibold mb-2">{label}</p>
            <p className="text-blue-600">
              Last-Click: {formatCurrency(data.lastClickRevenue)}
            </p>
            <p className="text-green-600">
              Assisted: {formatCurrency(data.assistedRevenue)}
            </p>
            <p className="text-purple-600">
              Lift: {lift}%
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex justify-center gap-6 mt-4">
        {payload.map((_entry, _index) => (
          <div key={_entry.value} className="flex items-center">
            <div 
              className="w-3 h-3 mr-2" 
              style={{ backgroundColor: _entry.color }}
            ></div>
            <span className="text-sm">{_entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  const insight = "Google Ads shows the highest assisted revenue lift at +47%, indicating strong influence on cross-channel conversions."
  const recommendation = "Increase Google Ads budget by 15% and create retargeting audiences for other channels to amplify assisted conversions."
  const impact = "Expected +$45K monthly revenue from enhanced cross-channel attribution strategy."

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Multi-Touch Attribution Analysis</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Insight:</strong> {insight}<br/>
          <strong>Recommendation:</strong> {recommendation}<br/>
          <strong>Impact:</strong> {impact}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onClick={handleBarClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="channel" 
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="assistedRevenue" 
            fill="#3b82f6" 
            name="Assisted Revenue"
            radius={[2, 2, 0, 0]}
            style={{ cursor: 'pointer' }}
          />
          <Bar 
            dataKey="lastClickRevenue" 
            fill="#10b981" 
            name="Last-Click Revenue"
            radius={[2, 2, 0, 0]}
            style={{ cursor: 'pointer' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 