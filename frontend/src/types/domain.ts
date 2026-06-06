// These are the data shapes used everywhere

// Frontend + Backend must match these exactly
export type Level = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6'

// type = only these exact strings allowed
// Level l = 'L7' → TypeScript ERROR
// Catches mistakes at compile time, not runtime
export type Track = 'IC' | 'Management'

// IC = Individual Contributor (no reports)
// Management = has direct reports

// CAPABILITY CODES
export type CapabilityCode =
    | 'SYSTEM_DESIGN'
    | 'TECHNICAL_DEPTH'
    | 'CODE_OWNERSHIP'
    | 'DEBUGGING'
    | 'COMMUNICATION'
    | 'PRODUCT_THINKING'
    | 'EXECUTION'
    | 'MENTORSHIP'
    | 'ARCHITECTURE_VISION'


// These 9 = the 9 axes on the radar chart
// Score 0-4 for each

// HUMAN READABLE NAMES
export const CAPABILITY_NAMES: Record<CapabilityCode, string> = {
    SYSTEM_DESIGN:       'System Design',
    TECHNICAL_DEPTH:     'Technical Depth',
    CODE_OWNERSHIP:      'Code Ownership',
    DEBUGGING:           'Debugging',
    COMMUNICATION:       'Communication',
    PRODUCT_THINKING:    'Product Thinking',
    EXECUTION:           'Execution',
    MENTORSHIP:          'Mentorship',
    ARCHITECTURE_VISION: 'Architecture',
}

// Record<K, V> = object where keys are K and values are V
// Same as { [key in CapabilityCode]: string }

// ALL CAPABILITIES AS ARRAY
export const ALL_CAPABILITIES: CapabilityCode[] = [
    'SYSTEM_DESIGN',
    'TECHNICAL_DEPTH',
    'CODE_OWNERSHIP',
    'DEBUGGING',
    'COMMUNICATION',
    'PRODUCT_THINKING',
    'EXECUTION',
    'MENTORSHIP',
    'ARCHITECTURE_VISION',
]

// Useful for looping: ALL_CAPABILITIES.map(...)

// ENGINEER
export interface Engineer {
    id: string
    name: string
    email: string
    currentLevel: Level        // must be L1-L6
    track: Track               // must be IC or Management
    team: string
    managerId?: string         // ? = optional field
    joinDate: string           // ISO date: "2022-03-15"
}

// interface = shape of an object
// TypeScript checks every field when you use Engineer

// CAPABILITY SNAPSHOT
export interface CapabilitySnapshot {
    id: string
    engineerId: string
    evaluatorId: string
    evaluatedAt: string                          // ISO datetime
    capabilities: Record<CapabilityCode, number> // 9 scores, 0-4
    notes?: string                               // optional
}

// This is one evaluation submitted by a manager
// Engineer can have many snapshots over time → growth tracking

// TARGET PROFILE
export interface TargetProfile {
    level: Level
    requirements: Record<CapabilityCode, number> // required score per capability
}

// Example: L4 requires SYSTEM_DESIGN >= 3
// Used to calculate gap: current score vs required score

// RADAR CHART DATA POINT
export interface RadarDataPoint {
    capability: string   // human readable: "System Design"
    current: number      // engineer's score
    target: number       // required score for next level
    fullMark: number     // always 4 (max possible)
}

// This is the shape recharts needs to render radar chart

// READINESS STATUS
export type ReadinessStatus =
    | 'PROMOTION_READY'   // score >= 80%, no gaps
    | 'STRETCH_READY'     // score 60-79%
    | 'IN_DEVELOPMENT'    // score < 60%

// CAPABILITY GAP
export interface CapabilityGap {
    capability: CapabilityCode
    capabilityName: string
    current: number     // what engineer has now
    required: number    // what next level needs
    gap: number         // required - current
}

// READINESS RESULT
export interface ReadinessResult {
    score: number              // 0-100 percentage
    status: ReadinessStatus
    gaps: CapabilityGap[]      // list of capabilities below target
    recommendations: string[]  // action items
}

// GROWTH RESULT
export interface GrowthResult {
    overallGrowth: number        // avg change across all capabilities
    improving: CapabilityCode[]  // went up since last snapshot
    declining: CapabilityCode[]  // went down
    stable: CapabilityCode[]     // no change
}

/*
Without types/domain.ts:
  Dashboard.tsx defines Engineer one way
  EngineerProfile.tsx defines it differently
  mockData.ts defines it a third way → Bugs everywhere, hard to find

With types/domain.ts:
  ONE source of truth
  Change Engineer here → error shows everywhere
  TypeScript guides you to fix all usages → Same contract frontend + backend use
*/
