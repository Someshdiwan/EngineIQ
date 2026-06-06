import type {
    CapabilitySnapshot,
    TargetProfile,
    CapabilityCode,
    ReadinessResult,
    ReadinessStatus,
    CapabilityGap,
    GrowthResult,
} from '../types/domain'
import { CAPABILITY_NAMES } from '../types/domain'

// CORE BUSINESS LOGIC
// This is the brain of EngineIQ
// Same formula must be used in backend too

// READINESS SCORE
export function calculateReadiness(
    snapshot: CapabilitySnapshot,
    target: TargetProfile
): ReadinessResult {

    const gaps: CapabilityGap[] = []
    let totalScore = 0
    let maxScore = 0
    let hasBlockingGap = false

    // Loop every capability and compare current vs required
    Object.entries(target.requirements).forEach(([cap, required]) => {
        const code = cap as CapabilityCode
        const current = snapshot.capabilities[code] ?? 0

        // Weighted score: current/required capped at 1.0
        // Example: current=3, required=4 → 3/4 = 0.75
        // Example: current=4, required=3 → capped at 1.0 (not 1.33)
        const capScore = Math.min(current / required, 1.0)
        totalScore += capScore * required   // weighted by importance
        maxScore   += required

        // Track gaps
        if (current < required) {
            const gap = required - current
            gaps.push({
                capability:     code,
                capabilityName: CAPABILITY_NAMES[code],
                current,
                required,
                gap,
            })

            // Blocking gap = more than 1 level behind
            // Example: required=4, current=2 → gap=2 → blocking
            if (gap > 1) hasBlockingGap = true
        }
    })

    // Final percentage
    const score = maxScore > 0
        ? Math.round((totalScore / maxScore) * 100)
        : 0

    // Determine status
    const status = getStatus(score, hasBlockingGap, gaps.length)

    return {
        score,
        status,
        gaps: gaps.sort((a, b) => b.gap - a.gap), // biggest gaps first
        recommendations: getRecommendations(gaps, status),
    }
}

// STATUS LOGIC
function getStatus(
    score: number,
    hasBlockingGap: boolean,
    gapCount: number
): ReadinessStatus {
    if (hasBlockingGap || score < 60) return 'IN_DEVELOPMENT'
    if (score >= 80 && gapCount === 0)  return 'PROMOTION_READY'
    return 'STRETCH_READY'
}

// IN_DEVELOPMENT  → score < 60 OR any gap > 1
// STRETCH_READY   → score 60-79 OR has small gaps
// PROMOTION_READY → score >= 80 AND zero gaps

// RECOMMENDATIONS
function getRecommendations(
    gaps: CapabilityGap[],
    status: ReadinessStatus
): string[] {
    if (status === 'PROMOTION_READY') {
        return [
            '🎉 Ready for promotion discussion with manager',
            '📄 Prepare promotion packet with recent achievements',
            '📅 Schedule calibration meeting this quarter',
        ]
    }

    const recs: string[] = []
    const top3 = gaps.slice(0, 3) // focus on top 3 gaps only

    top3.forEach(gap => {
        if (gap.gap >= 2) {
            recs.push(
                `🚨 ${gap.capabilityName}: needs +${gap.gap} levels — prioritize now`
            )
        } else {
            recs.push(
                `📈 ${gap.capabilityName}: needs +1 level to meet target`
            )
        }
    })

    if (gaps.length > 3) {
        recs.push(`📋 ${gaps.length - 3} more capabilities need attention`)
    }
    return recs
}

// GROWTH CALCULATION
export function calculateGrowth(
    latest: CapabilitySnapshot,
    previous: CapabilitySnapshot
): GrowthResult {
    const improving: CapabilityCode[] = []
    const declining: CapabilityCode[] = []
    const stable:    CapabilityCode[] = []
    let totalGrowth = 0

    Object.entries(latest.capabilities).forEach(([cap, currentVal]) => {
        const code     = cap as CapabilityCode
        const prevVal  = previous.capabilities[code] ?? 0
        const diff     = currentVal - prevVal

        totalGrowth += diff

        if (diff > 0) improving.push(code)
        else if (diff < 0) declining.push(code)
        else stable.push(code)
    })

    const overallGrowth =
        Math.round((totalGrowth / Object.keys(latest.capabilities).length) * 100) / 100
    // round to 2 decimal places
    // Example: totalGrowth=4, 9 capabilities → 4/9 = 0.44

    return { overallGrowth, improving, declining, stable }
}

// STATUS HELPERS
// Used in components for colors + labels

export function getStatusColor(status: ReadinessStatus): string {
    switch (status) {
        case 'PROMOTION_READY': return '#10b981'  // green
        case 'STRETCH_READY':   return '#f59e0b'  // amber
        case 'IN_DEVELOPMENT':  return '#64748b'  // gray
    }
}

export function getStatusLabel(status: ReadinessStatus): string {
    switch (status) {
        case 'PROMOTION_READY': return '✅ Promotion Ready'
        case 'STRETCH_READY':   return '🟠 Stretch Ready'
        case 'IN_DEVELOPMENT':  return '⚪ In Development'
    }
}

export function getStatusBg(status: ReadinessStatus): string {
    switch (status) {
        case 'PROMOTION_READY': return 'rgba(16,185,129,0.12)'
        case 'STRETCH_READY':   return 'rgba(245,158,11,0.12)'
        case 'IN_DEVELOPMENT':  return 'rgba(100,116,139,0.12)'
    }
}

/*
Object.entries(obj)
→ Converts object to array of [key, value] pairs
→ { SYSTEM_DESIGN: 3 } → [['SYSTEM_DESIGN', 3]]
→ Same as Map.entrySet() in Java

as CapabilityCode
→ Type assertion — tells TypeScript "trust me,
  this string is a CapabilityCode"
→ Needed because Object.entries returns string keys

?? 0
→ Nullish coalescing — if value is null/undefined → use 0
→ Safer than || 0 (which also catches 0, false, "")

Math.round(x * 100) / 100
→ Round to 2 decimal places
→ 0.4444 → 44.44 → round → 44 → 0.44

Weighted scoring logic:
→ Not all capabilities equal weight
→ A capability required at 4 matters more
   than one required at 1
→ totalScore += capScore * required
   gives higher weight to important caps
*/

/*
domain.ts        → defines shapes (Engineer, Snapshot, etc.)
     ↓
mockData.ts      → creates fake data using those shapes
     ↓
readinessCalc.ts → takes snapshot + target → calculates score
     ↓
(next) AppShell  → layout wrapper
(next) Dashboard → shows engineers list
(next) RadarChart→ visualizes the data
*/
