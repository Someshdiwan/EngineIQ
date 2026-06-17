import './AppShell.css'

// APP SHELL The outer wrapper of the entire app
// Contains: top navbar + main content area
// Every page renders INSIDE this shell

interface AppShellProps {
    children: React.ReactNode  // whatever page is active
    isDark: boolean
    onToggleTheme: () => void
    onHome: () => void         // clicking logo → goes to dashboard
}

export const AppShell: React.FC<AppShellProps> = ({
                                                      children,
                                                      isDark,
                                                      onToggleTheme,
                                                      onHome,
                                                  }) => {
    return (
        <div className="app-shell">

            {/* TOP NAVBAR */}
            <nav className="topnav">

                {/* Logo clicking goes home */}
                <button className="nav-logo" onClick={onHome}>
                    <span className="logo-icon">⬡</span>
                    <span className="logo-text">EngineIQ</span>
                </button>

                {/* Nav links center */}
                <div className="nav-links">
                    <button className="nav-link active" onClick={onHome}>
                        Dashboard
                    </button>
                </div>

                {/* Right side actions */}
                <div className="nav-actions">
                    <button
                        className="theme-toggle"
                        onClick={onToggleTheme}
                        title={isDark ? 'Switch to light' : 'Switch to dark'}
                    >
                        {isDark ? '☀️' : '🌙'}
                    </button>

                    <div className="nav-avatar" title="Manager">
                        M
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            {/* children = Dashboard or EngineerProfile or EvaluationForm */}
            <main className="main-content">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="app-footer">
                <span>EngineIQ © 2026</span>
                <span>Built with React + Spring Boot</span>
            </footer>

        </div>
    )
}

export default AppShell

/*
React.FC<AppShellProps>
→ Functional Component with TypeScript props interface
→ Gives us type safety for children, isDark, callbacks

children: React.ReactNode
→ Most flexible way to accept any valid JSX (single element, array, string, etc.)
→ Allows this shell to wrap any page content

onClick handlers
→ Pass functions from parent (App.tsx) down to child components
→ Keeps state management at the top level

title attribute
→ Native browser tooltip on hover
→ Good UX for theme toggle and avatar

Conditional rendering in JSX
→ {isDark ? '☀️' : '🌙'} = ternary operator
→ Same idea used in App.tsx for showing Dashboard vs EngineerProfile

CSS Modules / className strategy
→ All styles in AppShell.css
→ BEM-like or scoped naming recommended (app-shell, topnav, nav-logo, etc.)
*/
