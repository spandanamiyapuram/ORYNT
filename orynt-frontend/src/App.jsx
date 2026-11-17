import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SkillGap from './pages/SkillGap'
import Roadmap from './pages/Roadmap'
import MyProjects from './pages/MyProjects'
import JobApplications from './pages/JobApplications'

import './App.css'

function Home() {
  const features = [
    {
      icon: '🎯',
      title: 'Skill Gap Analysis',
      description: 'Discover the skills you need for your target career.',
    },
    {
      icon: '🗺️',
      title: 'Personalized Roadmaps',
      description: 'Follow structured learning paths towards your goals.',
    },
    {
      icon: '💻',
      title: 'Project-Based Learning',
      description: 'Build practical projects and showcase your abilities.',
    },
    {
      icon: '🚀',
      title: 'Career & Job Tracker',
      description: 'Organize applications and track your career progress.',
    },
  ]

  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="brand">
          <span className="brand-mark">O</span>
          <span>ORYNT</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          <a href="/login" className="login-link">Log in</a>
          <a href="/register" className="nav-button">Get Started ↗</a>
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot"></span>
              YOUR CAREER. YOUR DIRECTION.
            </div>

            <h1>
              Don't just learn.
              <br />
              <span>Build your future.</span>
            </h1>

            <p className="hero-description">
              Discover your strengths, bridge your skill gaps, build
              real-world projects and turn your potential into a career.
              Your journey starts with ORYNT.
            </p>

            <div className="hero-actions">
              <a href="/register" className="primary-button">
                Start Your Journey <span>↗</span>
              </a>
              <a href="#features" className="secondary-button">
                Explore Platform <span>↓</span>
              </a>
            </div>

            <div className="hero-note">
              <span>✦</span>
              Learn with purpose. Build with confidence.
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow"></div>
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="dashboard-card">
              <div className="dashboard-top">
                <div>
                  <span className="dashboard-label">YOUR CAREER SPACE</span>
                  <h3>Welcome to your future.</h3>
                </div>
                <span className="dashboard-icon">✦</span>
              </div>

              <div className="progress-card">
                <div className="progress-heading">
                  <span>Career readiness</span>
                  <strong>Getting started</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-value"></div>
                </div>
                <small>Your progress begins with one step.</small>
              </div>

              <div className="dashboard-grid">
                {features.map((feature) => (
                  <div className="mini-card" key={feature.title}>
                    <span>{feature.icon}</span>
                    <strong>{feature.title}</strong>
                    <small>Discover your next step</small>
                  </div>
                ))}
              </div>

              <div className="dashboard-footer">
                <span className="footer-dot"></span>
                Your journey, all in one place
              </div>
            </div>

            <div className="floating-tag tag-top">
              <span>✦</span> Find your direction
            </div>
            <div className="floating-tag tag-bottom">
              <span>↗</span> Build your potential
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="section-label">WHAT ORYNT OFFERS</span>
            <h2>
              Everything you need to
              <br />
              <span>move forward.</span>
            </h2>
            <p>
              A connected platform that turns learning into practical
              skills and career opportunities.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-top">
                  <span className="feature-icon">{feature.icon}</span>
                  <span className="feature-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <a href="/register" className="feature-link">
                  Get started <span>↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <span className="section-label">THE ORYNT APPROACH</span>
          <h2>
            Your potential deserves
            <br />
            <span>a clear direction.</span>
          </h2>
          <p>
            Learn the right skills, apply them through real projects
            and confidently showcase your abilities.
          </p>
          <a href="/register" className="primary-button">
            Build Your Future <span>↗</span>
          </a>
        </section>
      </main>

      <footer className="footer">
        <a href="#home" className="brand">
          <span className="brand-mark">O</span>
          <span>ORYNT</span>
        </a>
        <p>Prove your potential. Build your future.</p>
        <span className="copyright">© 2026 ORYNT</span>
      </footer>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('oryntToken')

  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/skill-gap"
          element={
            <ProtectedRoute>
              <SkillGap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <Roadmap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobApplications />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App