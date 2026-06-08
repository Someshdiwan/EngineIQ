import { useState, useMemo } from 'react'
import './Dashboard.css'
import { MOCK_ENGINEERS, getLatestSnapshot, getNextLevel, getTargetProfile } from '../../mocks/mockData'
import { calculateReadiness, getStatusColor, getStatusLabel } from '../../utils/readinessCalc'
import type { Engineer } from '../../types/domain'

// DASHBOARD — Engineer roster + stats
// First page user sees after login

interface DashboardProps {
    onSelectEngineer: (engineer: Engineer) => void
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectEngineer }) => {
    const [search, setSearch] = useState('')

    // CALCULATE READINESS FOR EACH ENGINEER
    // useMemo = only recalculate when MOCK_ENGINEERS changes
    // Without useMemo = recalculates on every keystroke in search
    const engineersWithReadiness = useMemo(() => {
        return MOCK_ENGINEERS.map(eng => {
            const snapshot = getLatestSnapshot(eng.id)
            if (!snapshot) return { ...eng, score: 0, status: 'IN_DEVELOPMENT' as const }

            const nextLevel    = getNextLevel(eng.currentLevel)
            const targetProfile = getTargetProfile(nextLevel)
            const readiness    = calculateReadiness(snapshot, targetProfile)

            return {
                ...eng,                    // spread all engineer fields
                score:  readiness.score,   // add score
                status: readiness.status,  // add status
            }
        })
    }, []) // empty array = run once on mount

    // FILTER BY SEARCH
    const filtered = engineersWithReadiness.filter(eng =>
        eng.name.toLowerCase().includes(search.toLowerCase()) ||
        eng.team.toLowerCase().includes(search.toLowerCase()) ||
        eng.email.toLowerCase().includes(search.toLowerCase())
    )

    // STATS FOR TOP CARDS
    const total      = engineersWithReadiness.length
    const readyCount = engineersWithReadiness.filter(e => e.status === 'PROMOTION_READY').length
    const avgScore   = Math.round(
        engineersWithReadiness.reduce((sum, e) => sum + e.score, 0) / total
    )

    return (
        <div className="dashboard">

            {/* PAGE HEADER */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Team Overview</h1>
                    <p className="page-subtitle">
                        Track growth and promotion readiness across your org
                    </p>
                </div>
            </div>

            {/* ── STAT CARDS ── */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">👥</div>
                    <div className="stat-body">
                        <div className="stat-value">{total}</div>
                        <div className="stat-label">Total Engineers</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">🚀</div>
                    <div className="stat-body">
                        <div className="stat-value">{readyCount}</div>
                        <div className="stat-label">Promotion Ready</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon purple">📈</div>
                    <div className="stat-body">
                        <div className="stat-value">{avgScore}%</div>
                        <div className="stat-label">Avg Readiness</div>
                    </div>
                </div>
            </div>

            {/* ROSTER TABLE */}
            <div className="roster-section">

                {/* Search bar */}
                <div className="roster-header">
                    <h2 className="roster-title">Engineering Roster</h2>
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, team or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="table-wrapper">
                    <table className="roster-table">
                        <thead>
                        <tr>
                            <th>Engineer</th>
                            <th>Team</th>
                            <th>Level</th>
                            <th>Readiness</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(eng => (
                            <tr
                                key={eng.id}
                                className="table-row"
                                onClick={() => onSelectEngineer(eng)}
                            >
                                {/* Engineer name + email */}
                                <td>
                                    <div className="engineer-cell">
                                        <div className="avatar">
                                            {eng.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="engineer-name">{eng.name}</div>
                                            <div className="engineer-email">{eng.email}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Team */}
                                <td>
                                    <span className="team-badge">{eng.team}</span>
                                </td>

                                {/* Level */}
                                <td>
                                    <span className="level-badge">{eng.currentLevel}</span>
                                </td>

                                {/* Readiness bar */}
                                <td>
                                    <div className="readiness-cell">
                                        <div className="readiness-bar-bg">
                                            <div
                                                className="readiness-bar-fill"
                                                style={{
                                                    width: `${eng.score}%`,
                                                    backgroundColor: getStatusColor(eng.status),
                                                }}
                                            />
                                        </div>
                                        <span className="readiness-pct">{eng.score}%</span>
                                    </div>
                                </td>

                                {/* Status pill */}
                                <td>
                    <span
                        className="status-pill"
                        style={{
                            color: getStatusColor(eng.status),
                            background: getStatusColor(eng.status) + '20',
                            border: `1px solid ${getStatusColor(eng.status)}40`,
                        }}
                    >
                      {getStatusLabel(eng.status)}
                    </span>
                                </td>

                                {/* Arrow */}
                                <td className="arrow-cell">→</td>
                            </tr>
                        ))}

                        {/* No results */}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="no-results">
                                    No engineers found for "{search}"
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
