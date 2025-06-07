import { formatNumber } from '@/lib/utils'

export const ProductLTVMatrix = ({ data, onAction }) => {
  // Create matrix structure
  const products = [...new Set(data.map(d => d.firstProduct))]
  const buckets = ['$0-50', '$50-100', '$100-200', '$200-500', '$500+']
  
  const getColorIntensity = (count) => {
    const maxCount = Math.max(...data.map(d => d.count))
    const intensity = count / maxCount
    return `rgba(59, 130, 246, ${intensity})` // Blue with varying opacity
  }

  const getCellData = (product, bucket) => {
    return data.find(d => d.firstProduct === product && d.LTVBucket === bucket)
  }

  const handleCellClick = (product, bucket, cellData) => {
    const cohort = {
      type: 'product_ltv_segment',
      firstProduct: product,
      LTVBucket: bucket,
      count: cellData?.count || 0,
      description: `${product} customers with ${bucket} LTV`
    }
    onAction(cohort)
  }

  const insight = "Skincare Set first-purchase customers show 65% higher likelihood of reaching $200+ LTV bucket compared to other product categories."
  const recommendation = "Prioritize Skincare Set in acquisition campaigns and create upsell paths from other products to skincare category."
  const impact = "Shifting 20% of new customers to skincare first purchase could increase average customer LTV by $34."

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">First Product Purchase LTV Matrix</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Insight:</strong> {insight}<br/>
          <strong>Recommendation:</strong> {recommendation}<br/>
          <strong>Impact:</strong> {impact}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="grid grid-cols-6 gap-1 mb-1">
            <div className="p-2"></div>
            {buckets.map(bucket => (
              <div key={bucket} className="p-2 text-center text-sm font-medium bg-muted rounded">
                {bucket}
              </div>
            ))}
          </div>

          {/* Matrix Body */}
          {products.map(product => (
            <div key={product} className="grid grid-cols-6 gap-1 mb-1">
              <div className="p-2 text-sm font-medium bg-muted rounded flex items-center">
                {product}
              </div>
              {buckets.map(bucket => {
                const cellData = getCellData(product, bucket)
                const count = cellData?.count || 0
                
                return (
                  <div
                    key={`${product}-${bucket}`}
                    className="p-3 rounded cursor-pointer border border-border hover:scale-105 transition-transform relative"
                    style={{ 
                      backgroundColor: getColorIntensity(count),
                      minHeight: '60px'
                    }}
                    onClick={() => handleCellClick(product, bucket, cellData)}
                    title={`${product} - ${bucket}: ${count} customers`}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-sm text-white drop-shadow">
                        {formatNumber(count)}
                      </div>
                      <div className="text-xs text-white/90 drop-shadow">
                        customers
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-4">
        <span className="text-sm text-muted-foreground">Customer Count:</span>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}></div>
          <span className="text-xs">Low</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.6)' }}></div>
          <span className="text-xs">Medium</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 1)' }}></div>
          <span className="text-xs">High</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {products.map(product => {
          const productData = data.filter(d => d.firstProduct === product)
          const totalCustomers = productData.reduce((sum, d) => sum + d.count, 0)
          const highValueCustomers = productData
            .filter(d => ['$200-500', '$500+'].includes(d.LTVBucket))
            .reduce((sum, d) => sum + d.count, 0)
          const highValueRate = totalCustomers > 0 ? (highValueCustomers / totalCustomers * 100).toFixed(1) : 0
          
          return (
            <div key={product} className="bg-muted/50 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">{product}</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Total: {formatNumber(totalCustomers)}</p>
                <p>High LTV: {highValueRate}%</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 