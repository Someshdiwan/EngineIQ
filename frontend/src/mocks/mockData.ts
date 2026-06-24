import type {
    Engineer,
    CapabilitySnapshot,
    TargetProfile,
    Level,
} from '../types/domain'

// WHY MOCK DATA?
// Backend doesn't exist yet
// Mock data = fake database in memory
// Later: delete this, replace with API calls

export const MOCK_ENGINEERS: Engineer[] = [
    {
        id: 'E-001',
        name: 'Sarah Li',
        email: 'SarahLi@EngineIQ.com',
        currentLevel: 'L3',
        track: 'IC',
        team: 'Platform',
        managerId: 'M-001',
        joinDate: '2026-03-15',
    },
    {
        id: 'E-002',
        name: 'Johnson Trump',
        email: 'JohnsonTrump@EngineIQ.com',
        currentLevel: 'L4',
        track: 'IC',
        team: 'Backend',
        managerId: 'M-001',
        joinDate: '2026-06-20',
    },
    {
        id: 'E-003',
        name: 'Priya Patel',
        email: 'priyaPatel@EngineIQ.com',
        currentLevel: 'L3',
        track: 'IC',
        team: 'Frontend',
        managerId: 'M-002',
        joinDate: '2023-01-10',
    },
    {
        id: 'E-004',
        name: 'Alex Kim',
        email: 'AlexKim@EngineIQ.com',
        currentLevel: 'L2',
        track: 'IC',
        team: 'Mobile',
        managerId: 'M-002',
        joinDate: '2026-09-01',
    },
    {
        id: 'E-005',
        name: 'Jordan Rivera',
        email: 'jordanRivera@EngineIQ.com',
        currentLevel: 'L4',
        track: 'Management',
        team: 'Platform',
        managerId: 'M-001',
        joinDate: '2026-11-15',
    },
]

// ─── SNAPSHOTS ────────────────────────────
// Each engineer has 2 snapshots = growth tracking
// Latest snapshot = current skills
// Previous snapshot = where they were before
export const MOCK_SNAPSHOTS: Record<string, CapabilitySnapshot[]> = {

    'E-001': [
        {
            id: 'SNAP-001-B',
            engineerId: 'E-001',
            evaluatorId: 'M-001',
            evaluatedAt: '2026-01-10T10:00:00Z',  // latest
            capabilities: {
                SYSTEM_DESIGN:       3,
                TECHNICAL_DEPTH:     3,
                CODE_OWNERSHIP:      4,
                DEBUGGING:           4,
                COMMUNICATION:       3,
                PRODUCT_THINKING:    2,
                EXECUTION:           4,
                MENTORSHIP:          2,
                ARCHITECTURE_VISION: 2,
            },
            notes: 'Strong execution. Needs mentorship growth.',
        },
        {
            id: 'SNAP-001-A',
            engineerId: 'E-001',
            evaluatorId: 'M-001',
            evaluatedAt: '2025-07-15T10:00:00Z',  // previous
            capabilities: {
                SYSTEM_DESIGN:       2,
                TECHNICAL_DEPTH:     2,
                CODE_OWNERSHIP:      3,
                DEBUGGING:           3,
                COMMUNICATION:       2,
                PRODUCT_THINKING:    2,
                EXECUTION:           3,
                MENTORSHIP:          1,
                ARCHITECTURE_VISION: 1,
            },
            notes: 'Good progress overall.',
        },
    ],

    'E-002': [
        {
            id: 'SNAP-002-B',
            engineerId: 'E-002',
            evaluatorId: 'M-001',
            evaluatedAt: '2026-01-05T10:00:00Z',  // latest
            capabilities: {
                SYSTEM_DESIGN:       4,
                TECHNICAL_DEPTH:     4,
                CODE_OWNERSHIP:      4,
                DEBUGGING:           4,
                COMMUNICATION:       3,
                PRODUCT_THINKING:    3,
                EXECUTION:           4,
                MENTORSHIP:          3,
                ARCHITECTURE_VISION: 3,
            },
            notes: 'Performing at Staff level in many areas.',
        },
        {
            id: 'SNAP-002-A',
            engineerId: 'E-002',
            evaluatorId: 'M-001',
            evaluatedAt: '2025-06-20T10:00:00Z',  // previous
            capabilities: {
                SYSTEM_DESIGN:       3,
                TECHNICAL_DEPTH:     4,
                CODE_OWNERSHIP:      4,
                DEBUGGING:           3,
                COMMUNICATION:       3,
                PRODUCT_THINKING:    2,
                EXECUTION:           4,
                MENTORSHIP:          2,
                ARCHITECTURE_VISION: 2,
            },
            notes: 'Strong technical foundation.',
        },
    ],

    'E-003': [
        {
            id: 'SNAP-003-B',
            engineerId: 'E-003',
            evaluatorId: 'M-002',
            evaluatedAt: '2026-01-08T10:00:00Z',  // latest
            capabilities: {
                SYSTEM_DESIGN:       2,
                TECHNICAL_DEPTH:     3,
                CODE_OWNERSHIP:      3,
                DEBUGGING:           3,
                COMMUNICATION:       4,
                PRODUCT_THINKING:    3,
                EXECUTION:           3,
                MENTORSHIP:          2,
                ARCHITECTURE_VISION: 1,
            },
            notes: 'Excellent communicator. Grow system design.',
        },
        {
            id: 'SNAP-003-A',
            engineerId: 'E-003',
            evaluatorId: 'M-002',
            evaluatedAt: '2025-08-01T10:00:00Z',  // previous
            capabilities: {
                SYSTEM_DESIGN:       1,
                TECHNICAL_DEPTH:     2,
                CODE_OWNERSHIP:      2,
                DEBUGGING:           2,
                COMMUNICATION:       3,
                PRODUCT_THINKING:    2,
                EXECUTION:           2,
                MENTORSHIP:          1,
                ARCHITECTURE_VISION: 1,
            },
            notes: 'New to team, good potential.',
        },
    ],

    'E-004': [
        {
            id: 'SNAP-004-B',
            engineerId: 'E-004',
            evaluatorId: 'M-002',
            evaluatedAt: '2025-12-15T10:00:00Z',  // latest (only one)
            capabilities: {
                SYSTEM_DESIGN:       1,
                TECHNICAL_DEPTH:     2,
                CODE_OWNERSHIP:      2,
                DEBUGGING:           2,
                COMMUNICATION:       2,
                PRODUCT_THINKING:    1,
                EXECUTION:           2,
                MENTORSHIP:          1,
                ARCHITECTURE_VISION: 1,
            },
            notes: 'Junior engineer ramping up. Good potential.',
        },
    ],

    'E-005': [
        {
            id: 'SNAP-005-B',
            engineerId: 'E-005',
            evaluatorId: 'M-001',
            evaluatedAt: '2026-01-12T10:00:00Z',  // latest
            capabilities: {
                SYSTEM_DESIGN:       4,
                TECHNICAL_DEPTH:     3,
                CODE_OWNERSHIP:      4,
                DEBUGGING:           3,
                COMMUNICATION:       4,
                PRODUCT_THINKING:    4,
                EXECUTION:           4,
                MENTORSHIP:          4,
                ARCHITECTURE_VISION: 3,
            },
            notes: 'Strong leader, ready for Principal track.',
        },
        {
            id: 'SNAP-005-A',
            engineerId: 'E-005',
            evaluatorId: 'M-001',
            evaluatedAt: '2025-07-01T10:00:00Z',  // previous
            capabilities: {
                SYSTEM_DESIGN:       3,
                TECHNICAL_DEPTH:     3,
                CODE_OWNERSHIP:      4,
                DEBUGGING:           3,
                COMMUNICATION:       4,
                PRODUCT_THINKING:    3,
                EXECUTION:           4,
                MENTORSHIP:          3,
                ARCHITECTURE_VISION: 2,
            },
            notes: 'Growing into leadership effectively.',
        },
    ],
}

// ─── TARGET PROFILES ──────────────────────
// What scores does each level require?
// Used to calculate gaps + readiness
export const TARGET_PROFILES: Record<Level, TargetProfile> = {
    L1: {
        level: 'L1',
        requirements: {
            SYSTEM_DESIGN: 1, TECHNICAL_DEPTH: 1, CODE_OWNERSHIP: 1,
            DEBUGGING: 1, COMMUNICATION: 1, PRODUCT_THINKING: 1,
            EXECUTION: 1, MENTORSHIP: 0, ARCHITECTURE_VISION: 0,
        },
    },
    L2: {
        level: 'L2',
        requirements: {
            SYSTEM_DESIGN: 1, TECHNICAL_DEPTH: 2, CODE_OWNERSHIP: 2,
            DEBUGGING: 2, COMMUNICATION: 2, PRODUCT_THINKING: 1,
            EXECUTION: 2, MENTORSHIP: 1, ARCHITECTURE_VISION: 1,
        },
    },
    L3: {
        level: 'L3',
        requirements: {
            SYSTEM_DESIGN: 2, TECHNICAL_DEPTH: 3, CODE_OWNERSHIP: 3,
            DEBUGGING: 3, COMMUNICATION: 2, PRODUCT_THINKING: 2,
            EXECUTION: 3, MENTORSHIP: 1, ARCHITECTURE_VISION: 1,
        },
    },
    L4: {
        level: 'L4',
        requirements: {
            SYSTEM_DESIGN: 3, TECHNICAL_DEPTH: 3, CODE_OWNERSHIP: 4,
            DEBUGGING: 3, COMMUNICATION: 3, PRODUCT_THINKING: 3,
            EXECUTION: 4, MENTORSHIP: 2, ARCHITECTURE_VISION: 2,
        },
    },
    L5: {
        level: 'L5',
        requirements: {
            SYSTEM_DESIGN: 4, TECHNICAL_DEPTH: 4, CODE_OWNERSHIP: 4,
            DEBUGGING: 4, COMMUNICATION: 4, PRODUCT_THINKING: 4,
            EXECUTION: 4, MENTORSHIP: 3, ARCHITECTURE_VISION: 3,
        },
    },
    L6: {
        level: 'L6',
        requirements: {
            SYSTEM_DESIGN: 4, TECHNICAL_DEPTH: 4, CODE_OWNERSHIP: 4,
            DEBUGGING: 4, COMMUNICATION: 4, PRODUCT_THINKING: 4,
            EXECUTION: 4, MENTORSHIP: 4, ARCHITECTURE_VISION: 4,
        },
    },
}

// ─── HELPER FUNCTIONS ─────────────────────
// These replace DB queries until backend is ready

// Get most recent snapshot for an engineer
// → same as: SELECT * FROM snapshots WHERE engineer_id = ?
//            ORDER BY evaluated_at DESC LIMIT 1
export function getLatestSnapshot(
    engineerId: string
): CapabilitySnapshot | null {
    const snaps = MOCK_SNAPSHOTS[engineerId]
    if (!snaps || snaps.length === 0) return null

    // [...snaps] = spread copies array before sorting
    // Never mutate original — React won't detect changes
    return [...snaps].sort(
        (a, b) =>
            new Date(b.evaluatedAt).getTime() -
            new Date(a.evaluatedAt).getTime()
    )[0]  // [0] = newest first
}

// Get second most recent snapshot (for growth comparison)
// → same as: SELECT * FROM snapshots WHERE engineer_id = ?
//            ORDER BY evaluated_at DESC LIMIT 1 OFFSET 1
export function getPreviousSnapshot(
    engineerId: string
): CapabilitySnapshot | null {
    const snaps = MOCK_SNAPSHOTS[engineerId]
    if (!snaps || snaps.length < 2) return null

    return [...snaps].sort(
        (a, b) =>
            new Date(b.evaluatedAt).getTime() -
            new Date(a.evaluatedAt).getTime()
    )[1]  // [1] = second newest
}

// Get next level for promotion target
// L3 → L4, L4 → L5, L6 → L6 (already at max)
export function getNextLevel(current: Level): Level {
    const order: Level[] = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6']
    const idx = order.indexOf(current)
    return idx < order.length - 1 ? order[idx + 1] : current
}

// Get target profile for a level
export function getTargetProfile(level: Level): TargetProfile {
    return TARGET_PROFILES[level]
}

/*
Record<string, T[]>
→ Object where key = engineerId, value = array of snapshots
→ Like a Map/HashMap in Java

[...snaps].sort(...)
→ Spread operator copies array before sorting
→ Never mutate original data — React won't detect changes

(a, b) => new Date(b).getTime() - new Date(a).getTime()
→ Sort descending (newest first)
→ If result > 0 → b comes first
→ If result < 0 → a comes first

Helper functions = simulate what backend queries will do
→ getLatestSnapshot() = SELECT * FROM snapshots WHERE engineer_id = ? ORDER BY evaluated_at DESC LIMIT 1
*/
