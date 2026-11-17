import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function JobApplications() {
  const [applications, setApplications] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('oryntApplications') || '[]'
      )
    } catch {
      return []
    }
  })

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    jobLink: '',
    notes: '',
  })

  useEffect(() => {
    localStorage.setItem(
      'oryntApplications',
      JSON.stringify(applications)
    )
  }, [applications])

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      location: '',
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      jobLink: '',
      notes: '',
    })

    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!formData.company.trim() || !formData.role.trim()) {
      setError('Company name and job role are required.')
      return
    }

    if (editingId !== null) {
      setApplications((previous) =>
        previous.map((application) =>
          application.id === editingId
            ? { ...application, ...formData }
            : application
        )
      )
    } else {
      const newApplication = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      }

      setApplications((previous) => [
        newApplication,
        ...previous,
      ])
    }

    resetForm()
  }

  const handleEdit = (application) => {
    setFormData({
      company: application.company,
      role: application.role,
      location: application.location,
      applicationDate: application.applicationDate,
      status: application.status,
      jobLink: application.jobLink,
      notes: application.notes,
    })

    setEditingId(application.id)
    setShowForm(true)
    setError('')
  }

  const handleDelete = (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this application?'
      )
    ) {
      setApplications((previous) =>
        previous.filter((application) => application.id !== id)
      )
    }
  }

  const handleStatusChange = (id, status) => {
    setApplications((previous) =>
      previous.map((application) =>
        application.id === id
          ? { ...application, status }
          : application
      )
    )
  }

  const appliedCount = applications.length

  const interviewCount = applications.filter(
    (item) => item.status === 'Interview'
  ).length

  const selectedCount = applications.filter(
    (item) => item.status === 'Selected'
  ).length

  const rejectedCount = applications.filter(
    (item) => item.status === 'Rejected'
  ).length

  const filteredApplications = applications.filter((item) => {
    const matchesSearch =
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase())

    const matchesFilter =
      filter === 'All' || item.status === filter

    return matchesSearch && matchesFilter
  })

  return (
    <div className="skill-gap-page">
      <header className="dashboard-navbar">
        <Link to="/dashboard" className="brand">
          <span className="brand-mark">O</span>
          ORYNT
        </Link>

        <Link to="/dashboard" className="back-dashboard">
          ← Back to Dashboard
        </Link>
      </header>

      <main className="skill-gap-content">
        <span className="section-label">CAREER MANAGEMENT</span>

        <h1>
          Track your <span>opportunities.</span>
        </h1>

        <p className="skill-gap-intro">
          Manage your job applications, follow interview progress
          and keep your career journey organized.
        </p>

        <section className="skill-assessment-card">
          <div className="assessment-heading">
            <span className="assessment-number">01</span>
            <div>
              <h2>Application Overview</h2>
              <p>Monitor your job search progress.</p>
            </div>
          </div>

          <div className="result-columns">
            <div className="result-list">
              <h3>Total Applications</h3>
              <strong>{appliedCount}</strong>
            </div>

            <div className="result-list">
              <h3>Interviews</h3>
              <strong>{interviewCount}</strong>
            </div>

            <div className="result-list">
              <h3>Selected</h3>
              <strong>{selectedCount}</strong>
            </div>

            <div className="result-list">
              <h3>Rejected</h3>
              <strong>{rejectedCount}</strong>
            </div>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            + Add Job Application
          </button>
        </section>

        {showForm && (
          <section className="skill-assessment-card">
            <div className="assessment-heading">
              <span className="assessment-number">02</span>
              <div>
                <h2>
                  {editingId !== null
                    ? 'Edit Application'
                    : 'Add Job Application'}
                </h2>
                <p>Enter your job application details.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Company Name *</label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />

              <label>Job Role *</label>
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Software Developer"
                required
              />

              <label>Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Hyderabad"
              />

              <label>Application Date</label>
              <input
                type="date"
                name="applicationDate"
                value={formData.applicationDate}
                onChange={handleChange}
              />

              <label>Application Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>

              <label>Job Posting Link</label>
              <input
                type="url"
                name="jobLink"
                value={formData.jobLink}
                onChange={handleChange}
                placeholder="https://company.com/jobs"
              />

              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add interview details or reminders..."
                rows="4"
              />

              {error && (
                <p className="assessment-error" role="alert">
                  {error}
                </p>
              )}

              <div className="assessment-bottom">
                <button type="submit" className="primary-button">
                  {editingId !== null
                    ? 'Update Application'
                    : 'Save Application'}
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="skill-assessment-card">
          <div className="assessment-heading">
            <span className="assessment-number">03</span>
            <div>
              <h2>My Applications</h2>
              <p>Review and manage your applications.</p>
            </div>
          </div>

          <input
            type="search"
            placeholder="Search company or job role..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="All">All Applications</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

          {filteredApplications.length === 0 ? (
            <p>
              {applications.length === 0
                ? 'No applications added yet. Start tracking your first opportunity!'
                : 'No applications match your search or filter.'}
            </p>
          ) : (
            filteredApplications.map((application) => (
              <article
                className="result-card"
                key={application.id}
              >
                <div className="result-details">
                  <h3>{application.company}</h3>

                  <p>
                    <strong>Role:</strong> {application.role}
                  </p>

                  <p>
                    <strong>Location:</strong>{' '}
                    {application.location || 'Not specified'}
                  </p>

                  <p>
                    <strong>Applied on:</strong>{' '}
                    {application.applicationDate || 'Not specified'}
                  </p>

                  <p>
                    <strong>Status:</strong> {application.status}
                  </p>

                  {application.notes && (
                    <p>
                      <strong>Notes:</strong> {application.notes}
                    </p>
                  )}

                  {application.jobLink && (
                    <p>
                      <a
                        href={application.jobLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Job Posting ↗
                      </a>
                    </p>
                  )}

                  <div className="assessment-bottom">
                    <button
                      className="secondary-button"
                      onClick={() => handleEdit(application)}
                    >
                      Edit
                    </button>

                    <button
                      className="secondary-button"
                      onClick={() => handleDelete(application.id)}
                    >
                      Delete
                    </button>

                    <select
                      value={application.status}
                      onChange={(event) =>
                        handleStatusChange(
                          application.id,
                          event.target.value
                        )
                      }
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default JobApplications