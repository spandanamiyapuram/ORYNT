import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const user = JSON.parse(
    sessionStorage.getItem('oryntUser') || '{}'
  )

  const handleLogout = () => {
    sessionStorage.removeItem('oryntToken')
    sessionStorage.removeItem('oryntUser')
    navigate('/login')
  }

  const features = [
    {
      icon: '🎯',
      title: 'Skill Gap Analysis',
      description: 'Discover the skills you need for your target career.',
      action: () => navigate('/skill-gap'),
      available: true,
    },
    {
      icon: '🗺️',
      title: 'Learning Roadmap',
      description: 'Follow a structured path towards your career goals.',
      action: () => navigate('/roadmap'),
      available: true,
    },
    {
      icon: '💻',
      title: 'My Projects',
      description: 'Build and showcase practical projects.',
      action: () => navigate('/projects'),
      available: true,
    },
    {
      icon: '🚀',
      title: 'Job Applications',
      description: 'Organize your applications and career opportunities.',
      action: () => navigate('/jobs'),
      available: true,
    },
  ]

  return (
    <div className="dashboard-page">
      <header className="dashboard-navbar">
        <a href="/" className="brand">
          <span className="brand-mark">O</span>
          ORYNT
        </a>

        <button onClick={handleLogout} className="logout-button">
          Log out ↗
        </button>
      </header>

      <main className="dashboard-content">
        <span className="section-label">YOUR CAREER SPACE</span>

        <h1>
          Welcome, <span>{user.name || 'Learner'}</span>!
        </h1>

        <p className="dashboard-intro">
          Your career journey starts here. Choose your next step and
          start building your future.
        </p>

        <div className="welcome-card">
          <div>
            <span className="section-label">YOUR ORYNT JOURNEY</span>
            <h2>Every great career starts with a direction.</h2>
            <p>Learn with purpose. Build with confidence.</p>
          </div>
          <span className="welcome-icon">✦</span>
        </div>

        <h2 className="dashboard-section-title">
          Explore your workspace
        </h2>

        <div className="dashboard-features">
          {features.map((feature) => (
            <article
              className={`dashboard-feature-card ${
                feature.available ? 'feature-active' : ''
              }`}
              key={feature.title}
            >
              <span className="dashboard-feature-icon">
                {feature.icon}
              </span>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

              {feature.available ? (
                <button
                  className="feature-action"
                  onClick={feature.action}
                >
                  Explore now →
                </button>
              ) : (
                <span className="coming-soon">Coming soon</span>
              )}
            </article>
          ))}
        </div>

        <div className="dashboard-profile">
          <h3>Your account</h3>
          <p>
            <strong>Name:</strong> {user.name || 'Not available'}
          </p>
          <p>
            <strong>Email:</strong> {user.email || 'Not available'}
          </p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard