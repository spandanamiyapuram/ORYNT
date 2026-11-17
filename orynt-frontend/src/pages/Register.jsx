import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
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
        'http://localhost:8080/api/orynt/register',
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
          data?.message || data?.error || 'Registration failed. Please try again.'
        )
      }

      setMessage('Registration successful! Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1200)
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
          <span className="section-label">START YOUR JOURNEY</span>
          <h1>Create your account</h1>
          <p>Build your skills. Prove your potential. Shape your future.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
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
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        <Link to="/" className="back-home">← Back to home</Link>
      </div>
    </div>
  )
}

export default Register