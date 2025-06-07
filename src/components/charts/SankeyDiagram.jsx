import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'
import { scaleOrdinal } from 'd3-scale'
import { getChartColors } from '@/lib/utils'

export const SankeyDiagram = ({ data, onAction }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return

    const svg = select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 800
    const height = 400
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }

    try {
      // Create nodes and links from data
      const nodeNames = Array.from(
        new Set(data.flatMap(d => [d.source, d.target]))
      )
      
      const nodes = nodeNames.map((name, i) => ({ 
        id: i, 
        name: name 
      }))
      
      const links = data.map(d => {
        const sourceIndex = nodeNames.indexOf(d.source)
        const targetIndex = nodeNames.indexOf(d.target)
        
        if (sourceIndex === -1 || targetIndex === -1) {
          console.warn('Invalid source or target in link:', d)
          return null
        }
        
        return {
          source: sourceIndex,
          target: targetIndex,
          value: d.value || 0
        }
      }).filter(Boolean) // Remove null links

      // Validate that we have valid data
      if (nodes.length === 0 || links.length === 0) {
        console.warn('No valid nodes or links for sankey diagram')
        return
      }

      const sankeyGenerator = sankey()
        .nodeId(d => d.id)
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])

      // Create a copy of the data for sankey processing
      const sankeyData = {
        nodes: nodes.map(d => ({ ...d })),
        links: links.map(d => ({ ...d }))
      }

      const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator(sankeyData)

      const colorScale = scaleOrdinal(getChartColors())

      // Add SVG
      const g = svg
        .attr('width', width)
        .attr('height', height)
        .append('g')

      // Add links
      g.append('g')
        .selectAll('path')
        .data(sankeyLinks)
        .join('path')
        .attr('d', sankeyLinkHorizontal())
        .attr('stroke', d => colorScale(d.source.name))
        .attr('stroke-width', d => Math.max(1, d.width))
        .attr('stroke-opacity', 0.6)
        .attr('fill', 'none')
        .style('cursor', 'pointer')
        .on('click', function(event, d) {
          if (onAction) {
            const cohort = {
              type: 'journey_path',
              source: d.source.name,
              target: d.target.name,
              users: d.value,
              description: `${d.source.name} → ${d.target.name} journey`
            }
            onAction(cohort)
          }
        })
        .on('mouseover', function(event, d) {
          select(this).attr('stroke-opacity', 0.8)
        })
        .on('mouseout', function(event, d) {
          select(this).attr('stroke-opacity', 0.6)
        })

      // Add nodes
      g.append('g')
        .selectAll('rect')
        .data(sankeyNodes)
        .join('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('height', d => d.y1 - d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('fill', d => colorScale(d.name))
        .attr('rx', 3)
        .style('cursor', 'pointer')
        .on('click', function(event, d) {
          if (onAction) {
            const cohort = {
              type: 'stage_users',
              stage: d.name,
              users: d.value || 0,
              description: `Users at ${d.name} stage`
            }
            onAction(cohort)
          }
        })

      // Add node labels
      g.append('g')
        .selectAll('text')
        .data(sankeyNodes)
        .join('text')
        .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr('y', d => (d.y1 + d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
        .text(d => d.name)
        .attr('font-size', '12px')
        .attr('fill', 'currentColor')
        
    } catch (error) {
      console.error('Error rendering sankey diagram:', error)
      // Show error message in the chart area
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'red')
        .text('Error loading chart data')
    }

  }, [data, onAction])

  const insight = "Multi-touch journeys drive 65% more revenue than single-touch paths. Email assists 40% of Google Ads conversions."
  const recommendation = "Increase email touchpoints in the first 3 days after Google Ads clicks to boost assisted conversions."
  const impact = "Projected +$127K monthly revenue from optimized email sequences."

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Customer Journey Flow</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Insight:</strong> {insight}<br/>
          <strong>Recommendation:</strong> {recommendation}<br/>
          <strong>Impact:</strong> {impact}
        </p>
      </div>
      <div className="flex justify-center">
        <svg ref={svgRef} className="max-w-full h-auto" />
      </div>
    </div>
  )
} 