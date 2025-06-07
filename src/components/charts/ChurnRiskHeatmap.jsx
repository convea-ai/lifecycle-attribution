import { formatNumber } from '@/lib/utils'

export const ChurnRiskHeatmap = ({ data, onAction }) => {
  // Create matrix structure
  const segments = [...new Set(data.map(d => d.segment))]
  const recencyBuckets = [...new Set(data.map(d => d.recency))]
  
  const getRiskColor = (riskScore) => {
    if (riskScore >= 75) return '#ef4444' // High risk - red
    if (riskScore >= 50) return '#f59e0b' // Medium risk - amber
    if (riskScore >= 25) return '#fbbf24' // Low-medium risk - yellow
    return '#10b981' // Low risk - green
  }

  const getRiskLabel = (riskScore) => {
    if (riskScore >= 75) return 'High'
    if (riskScore >= 50) return 'Medium'
    if (riskScore >= 25) return 'Low-Med'
    return 'Low'
  }

  const getCellData = (segment, recency) => {
    return data.find(d => d.segment === segment && d.recency === recency)
  }

  const handleCellClick = (segment, recency, cellData) => {
    const cohort = {
      type: 'churn_risk_segment',
      segment,
      recency,
      riskScore: cellData?.riskScore || 0,
      customers: cellData?.customers || 0,
      description: `${segment} customers with ${recency} recency - ${getRiskLabel(cellData?.riskScore || 0)} churn risk`
    }
    onAction(cohort)
  }

  const insight = "VIP customers with 61-90 days recency show alarming 78% churn risk, significantly higher than expected for high-value segment."
  const recommendation = "Implement immediate win-back campaign for VIP customers with 31+ days recency. Develop early warning system for high-value segments."
  const impact = "Reducing VIP churn by 25% could retain +$234K in annual revenue while improving customer satisfaction metrics."

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Customer Churn Risk Analysis</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Insight:</strong> {insight}<br/>
          <strong>Recommendation:</strong> {recommendation}<br/>
          <strong>Impact:</strong> {impact}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: `150px repeat(${recencyBuckets.length}, 1fr)` }}>
            <div className="p-2 font-medium">Customer Segment</div>
            {recencyBuckets.map(recency => (
              <div key={recency} className="p-2 text-center text-sm font-medium bg-muted rounded">
                {recency}
              </div>
            ))}
          </div>

          {/* Matrix Body */}
          {segments.map(segment => (
            <div key={segment} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `150px repeat(${recencyBuckets.length}, 1fr)` }}>
              <div className="p-3 text-sm font-medium bg-muted rounded flex items-center">
                {segment}
              </div>
              {recencyBuckets.map(recency => {
                const cellData = getCellData(segment, recency)
                const riskScore = cellData?.riskScore || 0
                const customers = cellData?.customers || 0
                
                return (
                  <div
                    key={`${segment}-${recency}`}
                    className="p-3 rounded cursor-pointer border border-border hover:scale-105 transition-transform relative"
                    style={{ 
                      backgroundColor: getRiskColor(riskScore),
                      color: 'white',
                      minHeight: '70px'
                    }}
                    onClick={() => handleCellClick(segment, recency, cellData)}
                    title={`${segment} - ${recency}: ${riskScore.toFixed(1)}% risk (${customers} customers)`}
                  >
                    <div className="text-center">
                      <div className="font-bold text-sm drop-shadow">
                        {riskScore.toFixed(0)}%
                      </div>
                      <div className="text-xs opacity-90 drop-shadow">
                        {getRiskLabel(riskScore)} Risk
                      </div>
                      <div className="text-xs opacity-75 mt-1 drop-shadow">
                        {formatNumber(customers)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Risk Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6">
        <span className="text-sm text-muted-foreground">Churn Risk Level:</span>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
          <span className="text-xs">Low (0-25%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
          <span className="text-xs">Low-Med (25-50%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
          <span className="text-xs">Medium (50-75%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
          <span className="text-xs">High (75%+)</span>
        </div>
      </div>

      {/* Segment Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {segments.map(segment => {
          const segmentData = data.filter(d => d.segment === segment)
          const totalCustomers = segmentData.reduce((sum, d) => sum + d.customers, 0)
          const avgRisk = segmentData.reduce((sum, d) => sum + (d.riskScore * d.customers), 0) / totalCustomers
          const highRiskCustomers = segmentData
            .filter(d => d.riskScore >= 75)
            .reduce((sum, d) => sum + d.customers, 0)
          
          return (
            <div key={segment} className="bg-muted/50 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">{segment}</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Total: {formatNumber(totalCustomers)}</p>
                <p>Avg Risk: {avgRisk.toFixed(1)}%</p>
                <p>High Risk: {formatNumber(highRiskCustomers)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 