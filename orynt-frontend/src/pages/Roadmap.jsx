import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = 'http://localhost:8080/api/orynt/roadmaps'
const TARGET_CAREER = 'Java Full Stack Developer'

const CAREER_API_URL = `${API_URL}/career/${encodeURIComponent(TARGET_CAREER)}`

const emptyForm = {
  skillName: '',
  description: '',
  duration: '',
  priority: 'Medium',
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px',
  marginTop: '7px',
  marginBottom: '12px',
  border: '1px solid #dce3ea',
  borderRadius: '8px',
  fontSize: '14px',
  fontFamily: 'inherit',
}

const formStyle = {
  marginTop: '18px',
  padding: '22px',
  border: '1px solid #dce3ea',
  borderRadius: '12px',
  display: 'grid',
  gap: '10px',
}

const actionStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginTop: '10px',
}

function Roadmap() {
  const [learningSteps, setLearningSteps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [savingId, setSavingId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSkill, setNewSkill] = useState(emptyForm)
  const [addingSkill, setAddingSkill] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [updatingSkill, setUpdatingSkill] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const token = sessionStorage.getItem('oryntToken')

  // Fetch roadmap
  const fetchRoadmap = useCallback(async () => {
    if (!token) {
      setError('Please log in again to view your roadmap.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(CAREER_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Unable to load your learning roadmap.')
      }

      const data = await response.json()
      setLearningSteps(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchRoadmap()
  }, [fetchRoadmap])

  // Add form changes
  const handleFormChange = (event) => {
    const { name, value } = event.target

    setNewSkill((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // Edit form changes
  const handleEditChange = (event) => {
    const { name, value } = event.target

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // Add new skill
  const addNewSkill = async (event) => {
    event.preventDefault()

    if (!token || addingSkill) return

    setAddingSkill(true)
    setError('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newSkill,
          targetCareer: TARGET_CAREER,
          skillName: newSkill.skillName.trim(),
          description: newSkill.description.trim(),
          duration: newSkill.duration.trim(),
          completed: false,
        }),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Unable to add the new skill.')
      }

      setNewSkill(emptyForm)
      setShowAddForm(false)
      await fetchRoadmap()
    } catch (err) {
      setError(err.message)
    } finally {
      setAddingSkill(false)
    }
  }

  // Start editing
  const startEditing = (step) => {
    setEditingId(step.id)

    setEditForm({
      skillName: step.skillName,
      description: step.description,
      duration: step.duration,
      priority: step.priority,
    })

    setShowAddForm(false)
    setError('')
  }

  // Update skill
  const updateSkill = async (event, step) => {
    event.preventDefault()

    if (!token || updatingSkill) return

    setUpdatingSkill(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/${step.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetCareer: step.targetCareer || TARGET_CAREER,
          skillName: editForm.skillName.trim(),
          description: editForm.description.trim(),
          duration: editForm.duration.trim(),
          priority: editForm.priority,
          completed: step.completed,
        }),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Unable to update the skill.')
      }

      const updatedStep = await response.json()

      setLearningSteps((previous) =>
        previous.map((item) =>
          item.id === updatedStep.id ? updatedStep : item
        )
      )

      setEditingId(null)
      setEditForm(emptyForm)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingSkill(false)
    }
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null)
    setEditForm(emptyForm)
  }

  // Delete skill
  const deleteSkill = async (step) => {
    if (!token || deletingId !== null) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${step.skillName}?`
    )

    if (!confirmed) return

    setDeletingId(step.id)
    setError('')

    try {
      const response = await fetch(`${API_URL}/${step.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Unable to delete the skill.')
      }

      setLearningSteps((previous) =>
        previous.filter((item) => item.id !== step.id)
      )

      if (editingId === step.id) {
        setEditingId(null)
        setEditForm(emptyForm)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  // Toggle completion
  const toggleCompletion = async (step) => {
    if (!token || savingId !== null || updatingSkill) return

    setSavingId(step.id)
    setError('')

    try {
      const response = await fetch(`${API_URL}/${step.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetCareer: step.targetCareer || TARGET_CAREER,
          skillName: step.skillName,
          description: step.description,
          duration: step.duration,
          priority: step.priority,
          completed: !step.completed,
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to update learning progress.')
      }

      const updatedStep = await response.json()

      setLearningSteps((previous) =>
        previous.map((item) =>
          item.id === updatedStep.id ? updatedStep : item
        )
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingId(null)
    }
  }

  // Calculate progress
  const completedCount = learningSteps.filter(
    (step) => step.completed
  ).length

  const progress =
    learningSteps.length > 0
      ? Math.round((completedCount / learningSteps.length) * 100)
      : 0

  return (
    <div className="roadmap-page">
      <div className="roadmap-header">
        <Link to="/dashboard" className="back-dashboard">
          ← Back to Dashboard
        </Link>

        <span className="section-label">
          YOUR LEARNING JOURNEY
        </span>

        <h1>
          Your Personalized <span>Learning Roadmap</span>
        </h1>

        <p>
          Turn your skill gaps into a structured learning journey.
        </p>
      </div>

      <div className="roadmap-card">
        <div className="roadmap-title">
          <div>
            <span className="section-label">TARGET CAREER</span>
            <h2>{TARGET_CAREER}</h2>
            <p>Your learning journey starts here.</p>
          </div>

          <div className="roadmap-icon">🗺️</div>
        </div>
        {!loading && (
          <div style={{ margin: '20px 0' }}>
            <button
              type="button"
              className="roadmap-complete-button"
              onClick={() => {
                setShowAddForm((previous) => !previous)
                setEditingId(null)
                setError('')
              }}
              disabled={addingSkill || updatingSkill}
            >
              {showAddForm ? '✕ Close Form' : '+ Add New Skill'}
            </button>

            {showAddForm && (
              <form onSubmit={addNewSkill} style={formStyle}>
                <h3>Add a New Learning Skill</h3>

                <label htmlFor="skillName">Skill Name</label>
                <input
                  id="skillName"
                  name="skillName"
                  value={newSkill.skillName}
                  onChange={handleFormChange}
                  placeholder="e.g. Hibernate"
                  required
                  maxLength={100}
                  style={inputStyle}
                />

                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newSkill.description}
                  onChange={handleFormChange}
                  placeholder="Describe what you want to learn..."
                  required
                  maxLength={500}
                  rows={3}
                  style={inputStyle}
                />

                <label htmlFor="duration">Duration</label>
                <input
                  id="duration"
                  name="duration"
                  value={newSkill.duration}
                  onChange={handleFormChange}
                  placeholder="e.g. 2 weeks"
                  required
                  maxLength={50}
                  style={inputStyle}
                />

                <label htmlFor="priority">Priority</label>
                <select
                  name="priority"
                  value={newSkill.priority}
                  onChange={handleFormChange}
                  style={inputStyle}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <button
                  type="submit"
                  className="roadmap-complete-button"
                  disabled={addingSkill}
                >
                  {addingSkill ? 'Adding Skill...' : 'Save New Skill →'}
                </button>
              </form>
            )}
          </div>
        )}

        {loading && <p>Loading your learning roadmap...</p>}

        {!loading && learningSteps.length > 0 && (
          <>
            <div className="roadmap-progress">
              <div className="roadmap-progress-heading">
                <div>
                  <h3>Your Learning Progress</h3>
                  <p>
                    {completedCount} of {learningSteps.length} skills completed
                  </p>
                </div>

                <strong>{progress}%</strong>
              </div>

              <div className="roadmap-progress-track">
                <div
                  className="roadmap-progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="roadmap-list">
              {learningSteps.map((step, index) => {
                const isCompleted = step.completed
                const isEditing = editingId === step.id

                return (
                  <div
                    className={`roadmap-step ${
                      isCompleted ? 'completed' : ''
                    }`}
                    key={step.id}
                  >
                    <div className="roadmap-step-number">
                      {isCompleted
                        ? '✓'
                        : String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="roadmap-step-content">
                      {isEditing ? (
                        <form
                          onSubmit={(event) => updateSkill(event, step)}
                          style={formStyle}
                        >
                          <h3>Edit Learning Skill</h3>

                          <label htmlFor={`edit-name-${step.id}`}>
                            Skill Name
                          </label>
                          <input
                            id={`edit-name-${step.id}`}
                            name="skillName"
                            value={editForm.skillName}
                            onChange={handleEditChange}
                            required
                            maxLength={100}
                            style={inputStyle}
                          />

                          <label htmlFor={`edit-description-${step.id}`}>
                            Description
                          </label>
                          <textarea
                            id={`edit-description-${step.id}`}
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            required
                            maxLength={500}
                            rows={3}
                            style={inputStyle}
                          />

                          <label htmlFor={`edit-duration-${step.id}`}>
                            Duration
                          </label>
                          <input
                            id={`edit-duration-${step.id}`}
                            name="duration"
                            value={editForm.duration}
                            onChange={handleEditChange}
                            required
                            maxLength={50}
                            style={inputStyle}
                          />

                          <label htmlFor={`edit-priority-${step.id}`}>
                            Priority
                          </label>
                          <select
                            id={`edit-priority-${step.id}`}
                            name="priority"
                            value={editForm.priority}
                            onChange={handleEditChange}
                            style={inputStyle}
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>

                          <div style={actionStyle}>
                            <button
                              type="submit"
                              className="roadmap-complete-button"
                              disabled={updatingSkill}
                            >
                              {updatingSkill
                                ? 'Saving Changes...'
                                : 'Save Changes ✓'}
                            </button>

                            <button
                              type="button"
                              className="roadmap-complete-button"
                              onClick={cancelEditing}
                              disabled={updatingSkill}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="roadmap-step-heading">
                            <h3>{step.skillName}</h3>

                            <span
                              className={`roadmap-priority ${
                                step.priority === 'High'
                                  ? 'high'
                                  : step.priority === 'Medium'
                                    ? 'medium'
                                    : 'low'
                              }`}
                            >
                              {step.priority} Priority
                            </span>
                          </div>

                          <p>{step.description}</p>

                          <div className="roadmap-step-meta">
                            <span>◷ {step.duration}</span>
                            <span>
                              {isCompleted ? '✓ Completed' : '○ Pending'}
                            </span>
                          </div>

                          <div className="roadmap-step-actions">
                            <button
                              type="button"
                              onClick={() => toggleCompletion(step)}
                              className={`roadmap-complete-button ${
                                isCompleted ? 'completed-button' : ''
                              }`}
                              disabled={
                                savingId !== null ||
                                updatingSkill ||
                                editingId !== null ||
                                deletingId !== null
                              }
                            >
                              {savingId === step.id
                                ? 'Saving...'
                                : isCompleted
                                  ? 'Mark as Pending'
                                  : 'Mark as Completed ✓'}
                            </button>

                            <button
                              type="button"
                              className="roadmap-complete-button"
                              onClick={() => startEditing(step)}
                              disabled={
                                savingId !== null ||
                                updatingSkill ||
                                editingId !== null ||
                                deletingId !== null
                              }
                            >
                              ✎ Edit
                            </button>

                            <button
                              type="button"
                              className="roadmap-complete-button"
                              onClick={() => deleteSkill(step)}
                              disabled={
                                savingId !== null ||
                                updatingSkill ||
                                editingId !== null ||
                                deletingId !== null
                              }
                            >
                              {deletingId === step.id
                                ? 'Deleting...'
                                : '🗑 Delete'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {!loading && learningSteps.length === 0 && !error && (
          <div className="roadmap-empty">
            <h3>Your learning journey is ready to begin!</h3>
            <p>Your roadmap is currently empty.</p>
          </div>
        )}

        {progress === 100 && learningSteps.length > 0 && (
          <div className="roadmap-success">
            🎉 Congratulations! You have completed all your roadmap skills.
          </div>
        )}

        {error && (
          <p className="assessment-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <p className="roadmap-note">
        Your learning progress is securely saved to your ORYNT account.
      </p>
    </div>
  )
}

export default Roadmap