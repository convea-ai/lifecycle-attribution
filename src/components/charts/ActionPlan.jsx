import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Mail, 
  Target,
  Sparkles,
  Calendar,
  ArrowRight
} from 'lucide-react'

export const ActionPlan = ({ data, onAction }) => {
  // Mock action plan data - in real app this would come from props
  const actionItems = [
    {
      id: 1,
      priority: 'High',
      category: 'Email Recovery',
      title: 'Implement Cart Abandonment Sequence',
      insight: 'Cart abandonment emails are only reaching 23% of abandoned carts, missing $89K in monthly recovery revenue.',
      recommendation: 'Deploy 3-email sequence: immediate (5min), reminder (24h), and final offer (72h) with 15% discount.',
      expectedImpact: '$127,000',
      impactType: 'monthly_revenue',
      effort: 'Medium',
      timeline: '1-2 weeks',
      confidence: 'High',
      icon: Mail,
      color: 'bg-red-50 border-red-200',
      badgeColor: 'bg-red-100 text-red-700'
    },
    {
      id: 2,
      priority: 'High',
      category: 'Attribution',
      title: 'Fix Google Ads Attribution Gap',
      insight: 'Google Ads shows 40% assisted conversion rate but only gets 15% attribution credit, causing $180K budget misallocation.',
      recommendation: 'Implement enhanced conversions and import offline conversion data to improve attribution accuracy.',
      expectedImpact: '$180,000',
      impactType: 'budget_optimization',
      effort: 'High',
      timeline: '2-3 weeks',
      confidence: 'High',
      icon: Target,
      color: 'bg-orange-50 border-orange-200',
      badgeColor: 'bg-orange-100 text-orange-700'
    },
    {
      id: 3,
      priority: 'Medium',
      category: 'Retention',
      title: 'Launch VIP Customer Reactivation',
      insight: 'VIP segment shows 67% churn risk but has 3.2x higher LTV. Only 12% receive targeted retention campaigns.',
      recommendation: 'Create personalized reactivation campaign with exclusive offers and dedicated success manager touchpoints.',
      expectedImpact: '$95,000',
      impactType: 'retention_revenue',
      effort: 'Medium',
      timeline: '1 week',
      confidence: 'Medium',
      icon: Users,
      color: 'bg-blue-50 border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 4,
      priority: 'Medium',
      category: 'Acquisition',
      title: 'Optimize TikTok Creative Performance',
      insight: 'TikTok ads have 45% lower conversion rate than Meta but 60% lower CPM. Creative fatigue detected after 3 days.',
      recommendation: 'Implement dynamic creative rotation with 5 new video variants weekly and pause underperforming ads automatically.',
      expectedImpact: '$67,000',
      impactType: 'efficiency_gain',
      effort: 'Low',
      timeline: '3-5 days',
      confidence: 'Medium',
      icon: TrendingUp,
      color: 'bg-green-50 border-green-200',
      badgeColor: 'bg-green-100 text-green-700'
    },
    {
      id: 5,
      priority: 'Low',
      category: 'Funnel',
      title: 'Reduce Checkout Abandonment',
      insight: 'Checkout abandonment rate increased 23% this month. Mobile checkout shows 67% higher abandonment than desktop.',
      recommendation: 'Simplify mobile checkout flow, add one-click payment options, and implement exit-intent popups with incentives.',
      expectedImpact: '$42,000',
      impactType: 'conversion_improvement',
      effort: 'Medium',
      timeline: '1-2 weeks',
      confidence: 'Medium',
      icon: DollarSign,
      color: 'bg-purple-50 border-purple-200',
      badgeColor: 'bg-purple-100 text-purple-700'
    }
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getEffortBadge = (effort) => {
    const colors = {
      'Low': 'bg-green-100 text-green-700',
      'Medium': 'bg-yellow-100 text-yellow-700',
      'High': 'bg-red-100 text-red-700'
    }
    return colors[effort] || 'bg-gray-100 text-gray-700'
  }

  const handleGetGuide = (action) => {
    // This would trigger an LLM call in the real implementation
    if (onAction) {
      onAction({
        type: 'get_action_guide',
        actionId: action.id,
        title: action.title,
        category: action.category,
        description: `Generate detailed implementation guide for: ${action.title}`
      })
    }
  }

  const totalImpact = actionItems.reduce((sum, item) => {
    return sum + parseInt(item.expectedImpact.replace(/[$,]/g, ''))
  }, 0)

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Target className="h-8 w-8" />
              Action Plan
            </h2>
            <p className="text-muted-foreground mt-2">
              Top 5 revenue optimization opportunities for this week
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Potential Impact</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalImpact)}</p>
            <p className="text-xs text-muted-foreground">monthly revenue</p>
          </div>
        </div>

        {/* Week Overview */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h3>
                <p className="text-sm text-blue-700">5 initiatives • Estimated 2-3 week completion • High-impact focus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <div className="space-y-4">
        {actionItems.map((action, index) => {
          const Icon = action.icon
          return (
            <Card key={action.id} className={`${action.color} transition-all hover:shadow-md`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(action.priority)}`} />
                      <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-5 w-5" />
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={action.badgeColor}>
                          {action.category}
                        </Badge>
                        <Badge variant="outline" className={getEffortBadge(action.effort)}>
                          {action.effort} effort
                        </Badge>
                        <Badge variant="outline">
                          {action.timeline}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{action.expectedImpact}</p>
                    <p className="text-xs text-muted-foreground">{action.impactType.replace('_', ' ')}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">💡 INSIGHT</h4>
                    <p className="text-sm">{action.insight}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">🎯 RECOMMENDATION</h4>
                    <p className="text-sm">{action.recommendation}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Confidence: {action.confidence}</span>
                      <span>•</span>
                      <span>Impact: {action.expectedImpact}/month</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleGetGuide(action)}
                      className="flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      Get AI Guide
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Stats */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{actionItems.filter(a => a.priority === 'High').length}</p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalImpact)}</p>
              <p className="text-sm text-muted-foreground">Total Impact</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">2-3</p>
              <p className="text-sm text-muted-foreground">Weeks to Complete</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">85%</p>
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 