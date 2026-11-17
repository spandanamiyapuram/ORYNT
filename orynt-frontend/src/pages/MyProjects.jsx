import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function MyProjects() {
  const [projects, setProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('oryntProjects') || '[]')
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
    title: '',
    description: '',
    technology: '',
    githubLink: '',
    liveLink: '',
    status: 'In Progress',
  })

  useEffect(() => {
    localStorage.setItem('oryntProjects', JSON.stringify(projects))
  }, [projects])

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technology: '',
      githubLink: '',
      liveLink: '',
      status: 'In Progress',
    })
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Project title and description are required.')
      return
    }

    if (editingId !== null) {
      setProjects((previous) =>
        previous.map((project) =>
          project.id === editingId
            ? { ...project, ...formData }
            : project
        )
      )
    } else {
      const newProject = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      }

      setProjects((previous) => [newProject, ...previous])
    }

    resetForm()
  }

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technology: project.technology,
      githubLink: project.githubLink,
      liveLink: project.liveLink,
      status: project.status,
    })

    setEditingId(project.id)
    setShowForm(true)
    setError('')
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects((previous) =>
        previous.filter((project) => project.id !== id)
      )
    }
  }

  const handleStatusChange = (id, status) => {
    setProjects((previous) =>
      previous.map((project) =>
        project.id === id ? { ...project, status } : project
      )
    )
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.technology.toLowerCase().includes(search.toLowerCase())

    const matchesFilter =
      filter === 'All' || project.status === filter

    return matchesSearch && matchesFilter
  })

  const completedCount = projects.filter(
    (project) => project.status === 'Completed'
  ).length

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
        <span className="section-label">PROJECT PORTFOLIO</span>

        <h1>
          Build your <span>portfolio.</span>
        </h1>

        <p className="skill-gap-intro">
          Showcase your practical experience, manage your projects
          and demonstrate what you can build.
        </p>

        <div className="skill-assessment-card">
          <div className="assessment-heading">
            <span className="assessment-number">01</span>
            <div>
              <h2>Your Project Overview</h2>
              <p>Track your practical development journey.</p>
            </div>
          </div>

          <div className="result-columns">
            <div className="result-list">
              <h3>Total Projects</h3>
              <strong>{projects.length}</strong>
            </div>

            <div className="result-list">
              <h3>Completed Projects</h3>
              <strong>{completedCount}</strong>
            </div>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            + Add New Project
          </button>
        </div>

        {showForm && (
          <section className="skill-assessment-card">
            <div className="assessment-heading">
              <span className="assessment-number">02</span>
              <div>
                <h2>
                  {editingId !== null ? 'Edit Project' : 'Add New Project'}
                </h2>
                <p>Enter your project details below.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Project Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                required
              />

              <label>Project Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what your project does"
                rows="4"
                required
              />

              <label>Technologies Used</label>
              <input
                name="technology"
                value={formData.technology}
                onChange={handleChange}
                placeholder="React, Java, Spring Boot, MySQL"
              />

              <label>GitHub Repository Link</label>
              <input
                name="githubLink"
                type="url"
                value={formData.githubLink}
                onChange={handleChange}
                placeholder="https://github.com/username/project"
              />

              <label>Live Project Link</label>
              <input
                name="liveLink"
                type="url"
                value={formData.liveLink}
                onChange={handleChange}
                placeholder="https://yourproject.com"
              />

              <label>Project Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Planned">Planned</option>
              </select>

              {error && (
                <p className="assessment-error" role="alert">
                  {error}
                </p>
              )}

              <div className="assessment-bottom">
                <button type="submit" className="primary-button">
                  {editingId !== null ? 'Update Project' : 'Save Project'}
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
              <h2>My Projects</h2>
              <p>Manage and showcase your work.</p>
            </div>
          </div>

          <input
            type="search"
            placeholder="Search projects or technologies..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="All">All Projects</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {filteredProjects.length === 0 ? (
            <p>
              {projects.length === 0
                ? 'No projects added yet. Start by adding your first project!'
                : 'No projects match your search or filter.'}
            </p>
          ) : (
            filteredProjects.map((project) => (
              <article className="result-card" key={project.id}>
                <div className="result-details">
                  <h3>{project.title}</h3>

                  <p>{project.description}</p>

                  {project.technology && (
                    <p>
                      <strong>Technologies:</strong> {project.technology}
                    </p>
                  )}

                  <p>
                    <strong>Status:</strong> {project.status}
                  </p>

                  <div className="assessment-bottom">
                    <button
                      className="secondary-button"
                      onClick={() => handleEdit(project)}
                    >
                      Edit
                    </button>

                    <button
                      className="secondary-button"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </button>

                    {project.status !== 'Completed' && (
                      <button
                        className="primary-button"
                        onClick={() =>
                          handleStatusChange(project.id, 'Completed')
                        }
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>

                  {project.githubLink && (
                    <p>
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View GitHub Repository ↗
                      </a>
                    </p>
                  )}

                  {project.liveLink && (
                    <p>
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Live Project ↗
                      </a>
                    </p>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default MyProjects