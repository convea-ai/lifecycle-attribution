import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { formatNumber, formatPercentage } from '@/lib/utils'

export const RepeatRateForecast = ({ data, onAction }) => {
  const handleLineClick = (data, index) => {
    if (data && data.activePayload) {
      const clickedData = data.activePayload[0].payload
      const cohort = {
        type: 'repeat_rate_cohort',
        cohortMonth: clickedData.cohortMonth,
        actualRate2nd: clickedData.actualRate2nd,
        forecastRate2nd: clickedData.forecastRate2nd,
        customers: clickedData.customers,
        description: `${clickedData.cohortMonth} cohort repeat rate analysis`
      }
      onAction(cohort)
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">
              Actual Rate: {data.actualRate2nd?.toFixed(1)}%
            </p>
            <p className="text-green-600">
              Forecast Rate: {data.forecastRate2nd?.toFixed(1)}%
            </p>
            <p className="text-purple-600">
              Cohort Size: {formatNumber(data.customers)}
            </p>
            {data.actualRate2nd && data.forecastRate2nd && (
              <p className="text-orange-600 font-medium">
                Variance: {(data.actualRate2nd - data.forecastRate2nd).toFixed(1)}%
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  // Calculate average rates for reference line
  const avgActualRate = data
    .filter(d => d.actualRate2nd)
    .reduce((sum, d) => sum + d.actualRate2nd, 0) / data.filter(d => d.actualRate2nd).length

  const insight = "Repeat purchase rates declining 2.3% month-over-month. Q4 forecast suggests continued downward trend without intervention."
  const recommendation = "Launch retention campaign targeting 60-day non-repeaters and implement post-purchase nurture sequence to improve repeat rates."
  const impact = "Increasing repeat rate by 5% could generate +$478K in additional revenue and improve customer LTV by 23%."

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Repeat Purchase Rate Forecast</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Insight:</strong> {insight}<br/>
          <strong>Recommendation:</strong> {recommendation}<br/>
          <strong>Impact:</strong> {impact}
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onClick={handleLineClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="cohortMonth" 
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Repeat Rate (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Reference line for average */}
          <ReferenceLine 
            y={avgActualRate} 
            stroke="#94a3b8" 
            strokeDasharray="5 5" 
            label="Historical Avg"
          />
          
          <Line
            type="monotone"
            dataKey="actualRate2nd"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Actual Repeat Rate"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#3b82f6' }}
            style={{ cursor: 'pointer' }}
            connectNulls={false}
          />
          
          <Line
            type="monotone"
            dataKey="forecastRate2nd"
            stroke="#10b981"
            strokeWidth={3}
            strokeDasharray="8 8"
            name="Forecast Repeat Rate"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#10b981' }}
            style={{ cursor: 'pointer' }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Forecast Analysis */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2 text-blue-600">Current Performance</h4>
          <div className="space-y-1 text-sm">
            <p>Latest Actual: {data[data.length - 1]?.actualRate2nd?.toFixed(1) || 'N/A'}%</p>
            <p>Historical Avg: {avgActualRate.toFixed(1)}%</p>
            <p>Trend: {data[data.length - 1]?.actualRate2nd > avgActualRate ? '↗️ Above' : '↘️ Below'} Average</p>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2 text-green-600">Forecast Outlook</h4>
          <div className="space-y-1 text-sm">
            <p>Next Month: {data[data.length - 1]?.forecastRate2nd?.toFixed(1) || 'N/A'}%</p>
            <p>3-Month Avg: {data.slice(-3).reduce((sum, d) => sum + (d.forecastRate2nd || 0), 0) / 3}%</p>
            <p>Direction: {data[data.length - 1]?.forecastRate2nd > data[data.length - 2]?.forecastRate2nd ? '↗️ Improving' : '↘️ Declining'}</p>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2 text-orange-600">Action Needed</h4>
          <div className="space-y-1 text-sm">
            <p>Risk Level: {avgActualRate < 20 ? '🔴 High' : avgActualRate < 25 ? '🟡 Medium' : '🟢 Low'}</p>
            <p>Priority: {data[data.length - 1]?.actualRate2nd < data[data.length - 1]?.forecastRate2nd ? 'Urgent' : 'Monitor'}</p>
            <p>Focus: Retention campaigns</p>
          </div>
        </div>
      </div>

      {/* Cohort Performance */}
      <div className="mt-6">
        <h4 className="font-medium mb-3">Cohort Performance Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.slice(-4).map((cohort, index) => (
            <div key={cohort.cohortMonth} className="bg-muted/30 rounded p-3">
              <div className="text-xs text-muted-foreground">{cohort.cohortMonth}</div>
              <div className="text-sm font-medium">
                {cohort.actualRate2nd ? `${cohort.actualRate2nd.toFixed(1)}%` : `${cohort.forecastRate2nd.toFixed(1)}%*`}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatNumber(cohort.customers)} customers
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">* Forecasted values</p>
      </div>
    </div>
  )
} 