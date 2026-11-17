import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8080/api/orynt/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || 'Invalid email or password.'
        )
      }

      sessionStorage.setItem('oryntToken', data.token)
      sessionStorage.setItem('oryntUser', JSON.stringify({
        id: data.userId,
        name: data.name,
        email: data.email,
      }))

      setMessage('Login successful! Opening your dashboard...')

      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (error) {
      setMessage(error.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <span className="brand-mark">O</span>
          ORYNT
        </Link>

        <div className="auth-heading">
          <span className="section-label">WELCOME BACK</span>
          <h1>Log in to ORYNT</h1>
          <p>Your next career milestone starts here.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {message && (
            <p className="auth-message" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>

        <Link to="/" className="back-home">← Back to home</Link>
      </div>
    </div>
  )
}

export default Login