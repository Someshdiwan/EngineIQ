import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts'

import type { RadarDataPoint } from '../../types/domain'

// CAPABILITY RADAR CHART
// Shows engineer's 9 capability scores
// as a polygon on a spider/radar chart

interface CapabilityRadarProps {
    data: RadarDataPoint[]          // 9 data points
    colors?: {
        current?: string            // color for current scores line
        target?:  string            // color for target scores line
    }

    height?: number               // chart height (default 320)
    showTarget?: boolean          // show target line or not
    showLegend?: boolean
}

// CUSTOM TOOLTIP
// Recharts calls this with active, payload, label
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null
    return (
        <div style={{
            background:    'rgba(15,23,42,0.95)',
            border:        '1px solid rgba(99,102,241,0.4)',
            borderRadius:  '10px',
            padding:       '12px 16px',
            boxShadow:     '0 8px 32px rgba(0,0,0,0.3)',
            backdropFilter:'blur(8px)',
        }}>
            {/* Capability name */}
            <p style={{
                color:        '#f1f5f9',
                fontWeight:   700,
                fontSize:     '13px',
                marginBottom: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom:'6px',
            }}>
                {label}
            </p>

            {/* Score for each line */}
            {payload.map((entry: any, i: number) => (
                <div key={i} style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        '8px',
                    marginTop:  '4px',
                }}>
                    <div style={{
                        width:        '10px',
                        height:       '10px',
                        borderRadius: '50%',
                        background:   entry.color,
                    }} />
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>
            {entry.name}:
          </span>
                    <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '12px' }}>
            {entry.value} / 4
          </span>
                </div>
            ))}
        </div>
    )
}

// MAIN COMPONENT
export const CapabilityRadar: React.FC<CapabilityRadarProps> = ({
                                                                    data,
                                                                    colors = {},
                                                                    height = 320,
                                                                    showTarget = true,
                                                                    showLegend = true,
                                                                }) => {

    // KEY FIX: Recharts cannot read CSS variables like var(primary)
    // Must pass actual hex values
    const currentColor = colors.current ?? '#6366f1'  // indigo
    const targetColor  = colors.target  ?? '#f59e0b'  // amber

    // Empty state
    if (!data || data.length === 0) {
        return (
            <div style={{
                height,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                color:          '#94a3b8',
                fontSize:       '14px',
            }}>
                No evaluation data available
            </div>
        )
    }

    return (
        <div style={{ width: '100%', height }}>
            {
                /*
        ResponsiveContainer — MUST have explicit height on parent div
        width="100%" = fills container
        height="100%" = fills parent div height
        This is why charts were blank before — no height on parent!
        */
            }
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                    data={data}
                    margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                >
                    {/* Background grid lines (the hexagon/polygon grid) */}
                    <PolarGrid
                        stroke="rgba(148,163,184,0.15)"
                        strokeWidth={1}
                    />

                    {/* Labels around the outside (capability names) */}
                    <PolarAngleAxis
                        dataKey="capability"
                        tick={{
                            fill:     '#94a3b8',
                            fontSize: 11,
                            fontWeight: 500,
                        }}
                        tickLine={false}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 4]}       // min=0, max=4
                        tickCount={5}         // shows 0,1,2,3,4
                        tick={{
                            fill:     '#64748b',
                            fontSize: 9,
                        }}
                        axisLine={false}
                    />

                    {/* TARGET line (dashed) shown behind current */}
                    {showTarget && (
                        <Radar
                            name="Target"
                            dataKey="target"
                            stroke={targetColor}
                            fill={targetColor}
                            fillOpacity={0.1}        // very transparent fill
                            strokeWidth={2}
                            strokeDasharray="5 3"    // dashed line
                        />
                    )}

                    {/* CURRENT line (solid) shown in front */}
                    <Radar
                        name="Current"
                        dataKey="current"
                        stroke={currentColor}
                        fill={currentColor}
                        fillOpacity={0.35}
                        // semi-transparent fill
                        strokeWidth={2.5}
                        dot={{
                            r:           4,
                            fill:        currentColor,
                            stroke:      '#1e293b',
                            strokeWidth: 2,
                        }}
                        activeDot={{
                            r:           6,
                            fill:        currentColor,
                            stroke:      '#fff',
                            strokeWidth: 2,
                        }}
                    />
                    {/* Tooltip on hover */}
                    <Tooltip content={<CustomTooltip />} />

                    {/* Legend below chart */}
                    {showLegend && (
                        <Legend
                            wrapperStyle={{
                                paddingTop:  '16px',
                                fontSize:    '13px',
                                color:       '#94a3b8',
                            }}
                        />
                    )}
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CapabilityRadar

/*
ResponsiveContainer width="100%" height="100%"
→ Makes chart fill its parent
→ Parent MUST have explicit pixel height
→ height="100%" on ResponsiveContainer needs
  a pixel height on the parent div
→ THIS is why radar charts were blank before

PolarGrid
→ The hexagon/polygon background grid
→ stroke = grid line color

PolarAngleAxis dataKey="capability"
→ Labels around the outside of radar
→ reads "capability" field from each data point

PolarRadiusAxis domain={[0, 4]}
→ Sets min/max scale
→ Our scores are 0-4 so domain=[0,4]

strokeDasharray="5 3"
→ Dashed line: 5px dash, 3px gap
→ Used for target line so it looks different

fillOpacity={0.35}
→ How transparent the filled area is
→ 0 = invisible, 1 = solid
→ 0.35 = 35% opaque = see-through

dot={{ r: 4 }}
→ Dots at each data point on the line
→ r = radius in pixels

activeDot
→ Bigger dot shown on hover
→ r: 6 = slightly larger than normal dot
*/
