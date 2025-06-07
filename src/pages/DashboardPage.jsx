import { useState } from 'react'
import { useFilters } from '@/hooks/useFilters'
import { useLifecycleData } from '@/hooks/useLifecycleData'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

// Import all chart components
import { SankeyDiagram } from '@/components/charts/SankeyDiagram'
import { AssistedRevenueBar } from '@/components/charts/AssistedRevenueBar'
import { HoldoutLiftHybrid } from '@/components/charts/HoldoutLiftHybrid'
import { IncrementalityScoreboard } from '@/components/charts/IncrementalityScoreboard'
import { FunnelWithMetrics } from '@/components/charts/FunnelWithMetrics'
import { BehaviorConversionScatter } from '@/components/charts/BehaviorConversionScatter'
import { LTVBySourceLine } from '@/components/charts/LTVBySourceLine'
import { ProductLTVMatrix } from '@/components/charts/ProductLTVMatrix'
import { ChurnRiskHeatmap } from '@/components/charts/ChurnRiskHeatmap'
import { RepeatRateForecast } from '@/components/charts/RepeatRateForecast'
import { ActionPlan } from '@/components/charts/ActionPlan'

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState('overview')
  const filters = useFilters()
  const lifecycleData = useLifecycleData(filters)

  // Handle cohort actions - this would integrate with external tools
  const handleCohortAction = (cohort) => {
    console.log('Cohort action triggered:', cohort)
    // In a real implementation, this would:
    // 1. Send cohort data to Klaviyo, Facebook Ads, etc.
    // 2. Show success/error notifications
    // 3. Track analytics events
    alert(`Cohort action: ${cohort.description}\nType: ${cohort.type}\nThis would be sent to your execution platform.`)
  }

  const chartSections = {
    overview: [
      {
        id: 'sankey',
        title: 'Customer Journey Flow',
        component: SankeyDiagram,
        data: lifecycleData.sankey.data,
        isLoading: lifecycleData.sankey.isLoading,
        span: 'col-span-2'
      },
      {
        id: 'assisted-revenue',
        title: 'Multi-Touch Attribution',
        component: AssistedRevenueBar,
        data: lifecycleData.assistedRevenue.data,
        isLoading: lifecycleData.assistedRevenue.isLoading,
        span: 'col-span-2'
      }
    ],
    attribution: [
      {
        id: 'assisted-revenue',
        title: 'Multi-Touch Attribution',
        component: AssistedRevenueBar,
        data: lifecycleData.assistedRevenue.data,
        isLoading: lifecycleData.assistedRevenue.isLoading,
        span: 'col-span-2'
      },
      {
        id: 'sankey',
        title: 'Customer Journey Flow',
        component: SankeyDiagram,
        data: lifecycleData.sankey.data,
        isLoading: lifecycleData.sankey.isLoading,
        span: 'col-span-2'
      }
    ],
    incrementality: [
      {
        id: 'holdout-lift',
        title: 'Holdout Test Results',
        component: HoldoutLiftHybrid,
        data: lifecycleData.holdoutLift.data,
        isLoading: lifecycleData.holdoutLift.isLoading,
        span: 'col-span-2'
      },
      {
        id: 'incrementality-scoreboard',
        title: 'Incrementality Performance',
        component: IncrementalityScoreboard,
        data: lifecycleData.incrementality.data,
        isLoading: lifecycleData.incrementality.isLoading,
        span: 'col-span-2'
      }
    ],
    funnel: [
      {
        id: 'funnel-metrics',
        title: 'Activation Funnel',
        component: FunnelWithMetrics,
        data: lifecycleData.funnel.data,
        isLoading: lifecycleData.funnel.isLoading,
        span: 'col-span-2'
      },
      {
        id: 'behavior-conversion',
        title: 'Behavior Analysis',
        component: BehaviorConversionScatter,
        data: lifecycleData.behaviorConversion.data,
        isLoading: lifecycleData.behaviorConversion.isLoading,
        span: 'col-span-2'
      }
    ],
    ltv: [
      {
        id: 'ltv-by-source',
        title: 'LTV by Source',
        component: LTVBySourceLine,
        data: lifecycleData.ltvBySource.data,
        isLoading: lifecycleData.ltvBySource.isLoading,
        span: 'col-span-2'
      },
      {
        id: 'product-ltv-matrix',
        title: 'Product LTV Matrix',
        component: ProductLTVMatrix,
        data: lifecycleData.productLTV.data,
        isLoading: lifecycleData.productLTV.isLoading,
        span: 'col-span-2'
      }
    ],
    retention: [
      {
        id: 'churn-risk',
        title: 'Churn Risk Analysis',
        component: ChurnRiskHeatmap,
        data: lifecycleData.churnRisk.data,
        isLoading: lifecycleData.churnRisk.isLoading,
        span: 'col-span-2'
      },
      {
        id: 'repeat-rate-forecast',
        title: 'Repeat Rate Forecast',
        component: RepeatRateForecast,
        data: lifecycleData.repeatRate.data,
        isLoading: lifecycleData.repeatRate.isLoading,
        span: 'col-span-2'
      }
    ],
    'action-plan': [
      {
        id: 'action-plan',
        title: 'Weekly Action Plan',
        component: ActionPlan,
        data: [], // ActionPlan uses internal mock data
        isLoading: false,
        span: 'col-span-2'
      }
    ]
  }

  const currentCharts = chartSections[activeSection] || chartSections.overview

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          filters={filters} 
          onFiltersChange={filters} 
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Title */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground capitalize">
                {                 activeSection === 'overview' ? 'Dashboard Overview' : 
                 activeSection === 'attribution' ? 'Multi-Channel Attribution' :
                 activeSection === 'incrementality' ? 'Incremental Lift Analysis' :
                 activeSection === 'funnel' ? 'Activation Funnel' :
                 activeSection === 'ltv' ? 'LTV by Source' :
                 activeSection === 'action-plan' ? 'Action Plan' :
                 'Retention Intelligence'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {                 activeSection === 'overview' ? 'Key insights across all attribution metrics' :
                 activeSection === 'attribution' ? 'Multi-touch journey analysis and assisted conversions' :
                 activeSection === 'incrementality' ? 'True incremental impact measurement' :
                 activeSection === 'funnel' ? 'User activation and conversion optimization' :
                 activeSection === 'ltv' ? 'Customer lifetime value by acquisition channel' :
                 activeSection === 'action-plan' ? 'Revenue optimization opportunities and implementation roadmap' :
                 'Customer retention and churn prevention insights'}
              </p>
            </div>

            {/* Charts Grid or Action Plan */}
            {activeSection === 'action-plan' ? (
              // Special full-width layout for Action Plan
              <div>
                {currentCharts.map((chart) => {
                  const ChartComponent = chart.component
                  return (
                    <div key={chart.id}>
                      <ChartComponent 
                        data={chart.data} 
                        onAction={handleCohortAction}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              // Regular grid layout for charts
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentCharts.map((chart) => {
                  const ChartComponent = chart.component
                  
                  return (
                    <Card key={chart.id} className={`${chart.span || ''} h-fit`}>
                      <CardHeader>
                        <CardTitle className="text-xl">{chart.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {chart.isLoading ? (
                          <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        ) : chart.data ? (
                          <ChartComponent 
                            data={chart.data} 
                            onAction={handleCohortAction}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-64 text-muted-foreground">
                            No data available
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">
                            Click chart elements to create targeted cohorts
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleCohortAction({
                            type: 'chart_export',
                            chartId: chart.id,
                            description: `Export ${chart.title} data for campaign creation`
                          })}
                          className="ml-4"
                        >
                          Act on Data →
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Loading State */}
            {lifecycleData.isLoading && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-card p-6 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <p className="text-foreground">Loading attribution data...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {lifecycleData.isError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-6">
                <p className="text-destructive font-medium">
                  Error loading data. Please check your connection and try again.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage 