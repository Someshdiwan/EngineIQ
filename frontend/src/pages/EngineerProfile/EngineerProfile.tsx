import { useMemo } from 'react'

import './EngineerProfile.css'

import {
    getLatestSnapshot,
    getPreviousSnapshot,
    getNextLevel,
    getTargetProfile,
} from '../../mocks/mockData'

import {
    calculateReadiness,
    calculateGrowth,
    getStatusColor,
    getStatusLabel,
    getStatusBg,
} from '../../utils/readinessCalc'

import { CapabilityRadar } from '../../components/charts/CapabilityRadar'

import { CAPABILITY_NAMES, type Engineer, type RadarDataPoint } from '../../types/domain'

// ENGINEER PROFILE PAGE
// Shows full breakdown for one engineer:
// → Identity card
// → Readiness score + progress bar
// → Dual radar charts (current vs target + growth)
// → Gap analysis
// → Recommendations

interface EngineerProfileProps {
    engineer: Engineer
    onBack: () => void
}

export const EngineerProfile: React.FC<EngineerProfileProps> = ({
                                                                    engineer,
                                                                    onBack,
                                                                }) => {

    // DATA SETUP
    const latestSnapshot   = getLatestSnapshot(engineer.id)
    const previousSnapshot = getPreviousSnapshot(engineer.id)
    const nextLevel        = getNextLevel(engineer.currentLevel)
    const targetProfile    = getTargetProfile(nextLevel)

    // READINESS
    const readiness = useMemo(() => {
        if (!latestSnapshot) return null
        return calculateReadiness(latestSnapshot, targetProfile)
    }, [latestSnapshot, targetProfile])

    // GROWTH
    const growth = useMemo(() => {
        if (!latestSnapshot || !previousSnapshot) return null
        return calculateGrowth(latestSnapshot, previousSnapshot)
    }, [latestSnapshot, previousSnapshot])

    // RADAR DATA: Current vs Target
    // This is what the first radar chart needs
    const currentVsTargetData: RadarDataPoint[] = useMemo(() => {
        if (!latestSnapshot) return []
        return Object.entries(latestSnapshot.capabilities).map(([cap, current]) => ({
            capability: CAPABILITY_NAMES[cap as keyof typeof CAPABILITY_NAMES],
            current,
            target: targetProfile.requirements[cap as keyof typeof targetProfile.requirements] ?? 0,
            fullMark: 4,
        }))
    }, [latestSnapshot, targetProfile])

    // RADAR DATA: Growth (Latest vs Previous)
    // This is what the second radar chart needs
    const growthRadarData: RadarDataPoint[] = useMemo(() => {
        if (!latestSnapshot || !previousSnapshot) return []
        return Object.entries(latestSnapshot.capabilities).map(([cap, current]) => ({
            capability: CAPABILITY_NAMES[cap as keyof typeof CAPABILITY_NAMES],
            current,
            target: previousSnapshot.capabilities[cap as keyof typeof previousSnapshot.capabilities] ?? 0,
            fullMark: 4,
        }))
    }, [latestSnapshot, previousSnapshot])

    // NO DATA STATE
    if (!latestSnapshot || !readiness) {
        return (
            <div className="profile-empty">
                <div className="empty-icon">📊</div>
                <h2>No Evaluation Data</h2>
                <p>No snapshots found for this engineer.</p>
                <button className="btn-back" onClick={onBack}>← Back</button>
            </div>
        )
    }

    return (
        <div className="engineer-profile">
            {/* BREADCRUMB */}
            <div className="breadcrumb">
                <button className="breadcrumb-back" onClick={onBack}>
                    ← Dashboard
                </button>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">{engineer.name}</span>
            </div>

            {/* IDENTITY CARD */}
            <div className="profile-card identity-card">
                <div className="identity-left">
                    <div className="profile-avatar">
                        {engineer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{engineer.name}</h1>
                        <p className="profile-email">{engineer.email}</p>
                        <div className="profile-badges">
              <span className="badge badge-level">
                Level {engineer.currentLevel}
              </span>
                            <span className="badge badge-track">
                {engineer.track}
              </span>
                            <span className="badge badge-team">
                {engineer.team}
              </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* READINESS CARD */}
            <div className="profile-card readiness-card">
                <div className="readiness-top">
                    <div>
                        <h2 className="card-title">Promotion Readiness</h2>
                        <p className="card-subtitle">
                            Targeting: <strong>{nextLevel}</strong>
                        </p>
                    </div>
                    <div className="readiness-score-block">
                        <div
                            className="readiness-score-number"
                            style={{ color: getStatusColor(readiness.status) }}
                        >
                            {readiness.score}%
                        </div>
                        <div
                            className="readiness-status-label"
                            style={{
                                color:      getStatusColor(readiness.status),
                                background: getStatusBg(readiness.status),
                                border:     `1px solid ${getStatusColor(readiness.status)}40`,
                            }}
                        >
                            {getStatusLabel(readiness.status)}
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{
                            width:           `${readiness.score}%`,
                            backgroundColor: getStatusColor(readiness.status),
                        }}
                    />
                    {/* Milestone markers */}
                    <div className="milestone" style={{ left: '60%' }}>
                        <span className="milestone-label">60%</span>
                    </div>
                    <div className="milestone" style={{ left: '80%' }}>
                        <span className="milestone-label">80%</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="readiness-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#64748b' }} />
            In Development (&lt;60%)
          </span>
                    <span className="legend-item">
            <span className="legend-dot" style={{ background: '#f59e0b' }} />
            Stretch Ready (60-79%)
          </span>
                    <span className="legend-item">
            <span className="legend-dot" style={{ background: '#10b981' }} />
            Promotion Ready (≥80%)
          </span>
                </div>
            </div>

            {/* DUAL RADAR CHARTS */}
            <div className="charts-row">

                {/* Chart 1: Current vs Target */}
                <div className="profile-card chart-card">
                    <h2 className="card-title">Current vs Target</h2>
                    <p className="card-subtitle">Gap analysis for {nextLevel}</p>
                    <div className="chart-wrapper">
                        <CapabilityRadar
                            data={currentVsTargetData}
                            showTarget={true}
                            colors={{
                                current: '#6366f1',   // indigo = current
                                target:  '#f59e0b',   // amber  = target
                            }}
                            height={320}
                        />
                    </div>
                    <div className="chart-legend">
            <span className="chart-legend-item">
              <span className="legend-line solid indigo" />
              Current
            </span>
                        <span className="chart-legend-item">
              <span className="legend-line dashed amber" />
                            {nextLevel} Target
            </span>
                    </div>
                </div>

                {/* Chart 2: Growth over time */}
                {previousSnapshot && growth && (
                    <div className="profile-card chart-card">
                        <h2 className="card-title">Growth Over Time</h2>
                        <p className="card-subtitle">Latest vs previous review</p>

                        {/* Growth summary pills */}
                        <div className="growth-pills">
              <span className="growth-pill improving">
                ↗ {growth.improving.length} Improving
              </span>
                            <span className="growth-pill stable">
                → {growth.stable.length} Stable
              </span>
                            {growth.declining.length > 0 && (
                                <span className="growth-pill declining">
                  ↘ {growth.declining.length} Declining
                </span>
                            )}
                            <span className="growth-pill overall"
                                  style={{
                                      color: growth.overallGrowth >= 0 ? '#10b981' : '#ef4444'
                                  }}
                            >
                Overall: {growth.overallGrowth > 0 ? '+' : ''}
                                {growth.overallGrowth}
              </span>
                        </div>

                        <div className="chart-wrapper">
                            <CapabilityRadar
                                data={growthRadarData}
                                showTarget={true}
                                colors={{
                                    current: '#10b981',  // green  = latest
                                    target:  '#94a3b8',  // gray   = previous
                                }}
                                height={280}
                            />
                        </div>
                        <div className="chart-legend">
              <span className="chart-legend-item">
                <span className="legend-line solid green" />
                Latest Review
              </span>
                            <span className="chart-legend-item">
                <span className="legend-line dashed gray" />
                Previous Review
              </span>
                        </div>
                    </div>
                )}
            </div>

            {/* GAP ANALYSIS */}
            {readiness.gaps.length > 0 && (
                <div className="profile-card">
                    <h2 className="card-title">Gap Analysis</h2>
                    <p className="card-subtitle">
                        Capabilities below {nextLevel} requirements
                    </p>
                    <div className="gaps-grid">
                        {readiness.gaps.map(gap => (
                            <div key={gap.capability} className="gap-card">
                                <div className="gap-header">
                                    <span className="gap-name">{gap.capabilityName}</span>
                                    <span className="gap-delta">+{gap.gap} needed</span>
                                </div>
                                <div className="gap-scores">
                                    <span>Current: <strong>{gap.current}</strong></span>
                                    <span>Required: <strong>{gap.required}</strong></span>
                                </div>
                                <div className="gap-bar-bg">
                                    <div
                                        className="gap-bar-current"
                                        style={{ width: `${(gap.current / 4) * 100}%` }}
                                    />
                                    <div
                                        className="gap-bar-target"
                                        style={{ left: `${(gap.required / 4) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* RECOMMENDATIONS */}
            <div className="profile-card">
                <h2 className="card-title">Recommended Actions</h2>
                <div className="recs-list">
                    {readiness.recommendations.map((rec, i) => (
                        <div key={i} className="rec-item">
                            <span className="rec-text">{rec}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default EngineerProfile

/*
Conditional rendering: condition ? <A /> : <B />
→ If selected engineer → show profile
→ Otherwise → show dashboard
→ This is React's version of if/else in JSX

useMemo dependencies
→ useMemo(() => ..., [latestSnapshot, targetProfile])
→ Only recalculates when these values change
→ Not on every render

Object.entries().map()
→ Convert capability scores object
  into array of RadarDataPoint
→ Each entry = one axis on the radar

chart-wrapper height: 320px
→ THE key fix for blank radar charts
→ ResponsiveContainer needs parent height
→ Without this = chart renders at 0px height
*/
