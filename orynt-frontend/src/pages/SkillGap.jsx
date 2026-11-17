import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = 'http://localhost:8080/api/orynt/skill-gap'
const ROADMAP_API = 'http://localhost:8080/api/orynt/roadmaps'

const careerSkills = {
  'Java Full Stack Developer': [
    'Java',
    'OOP Concepts',
    'Data Structures',
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Spring Boot',
    'MySQL',
    'REST APIs',
    'Git',
  ],
  'Python Developer': [
    'Python',
    'OOP Concepts',
    'Data Structures',
    'SQL',
    'MySQL',
    'Flask',
    'Django',
    'REST APIs',
    'Git',
    'Testing',
  ],
  'Frontend Developer': [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Responsive Design',
    'REST APIs',
    'Git',
    'TypeScript',
    'Testing',
  ],
}

function SkillGap() {
  const [career, setCareer] = useState('Java Full Stack Developer')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [assessment, setAssessment] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [roadmapLoading, setRoadmapLoading] = useState(false)
  const [roadmapMessage, setRoadmapMessage] = useState('')
  const [error, setError] = useState('')

  const requiredSkills = careerSkills[career]
  const token = sessionStorage.getItem('oryntToken')

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setError('Your login session has expired. Please log in again.')
        setHistoryLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/history`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Unable to load assessment history.')
        }

        const data = await response.json()
        setHistory(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setHistoryLoading(false)
      }
    }

    fetchHistory()
  }, [token])

  const handleCareerChange = (event) => {
    setCareer(event.target.value)
    setSelectedSkills([])
    setAssessment(null)
    setRoadmapMessage('')
    setError('')
  }

  const handleSkillChange = (skill) => {
    setSelectedSkills((previous) =>
      previous.includes(skill)
        ? previous.filter((item) => item !== skill)
        : [...previous, skill]
    )

    setAssessment(null)
    setRoadmapMessage('')
    setError('')
  }

  const analyzeSkills = async () => {
    if (!token) {
      setError('Please log in again to analyze your skills.')
      return
    }

    setLoading(true)
    setError('')
    setAssessment(null)
    setRoadmapMessage('')

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetCareer: career,
          existingSkills: selectedSkills,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Skill analysis failed. Please try again.'
        )
      }

      setAssessment(data)

      const historyResponse = await fetch(`${API_URL}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        setHistory(historyData)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Generate or update the career-specific learning roadmap.
  const generateRoadmap = async () => {
    if (!token) {
      setError('Please log in again to generate your roadmap.')
      return
    }

    if (!assessment) {
      setError('Please analyze your skills first.')
      return
    }

    setRoadmapLoading(true)
    setRoadmapMessage('')
    setError('')

    try {
      // Fetch only the selected career's roadmap.
      const response = await fetch(
        `${ROADMAP_API}/career/${encodeURIComponent(career)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Unable to fetch your career roadmap.')
      }

      const roadmapItems = await response.json()

      const normalize = (name) => name.trim().toLowerCase()

      const existingSkills = assessment.existingSkills || selectedSkills
      const missingSkills = assessment.missingSkills || []

      let completedCount = 0
      let addedCount = 0

      // STEP 1: Mark existing skills as completed.
      for (const skill of existingSkills) {
        const item = roadmapItems.find(
          (roadmap) =>
            normalize(roadmap.skillName) === normalize(skill)
        )

        if (item && !item.completed) {
          const updateResponse = await fetch(
            `${ROADMAP_API}/${item.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                skillName: item.skillName,
                description: item.description,
                duration: item.duration,
                priority: item.priority,
                completed: true,
              }),
            }
          )

          if (!updateResponse.ok) {
            throw new Error(
              `Could not mark ${skill} as completed.`
            )
          }

          completedCount++
        }
      }

      // STEP 2: Add only missing skills that do not already exist.
      const existingNames = roadmapItems.map((item) =>
        normalize(item.skillName)
      )

      for (let index = 0; index < missingSkills.length; index++) {
        const skill = missingSkills[index]

        if (existingNames.includes(normalize(skill))) {
          continue
        }

        const createResponse = await fetch(ROADMAP_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            targetCareer: career,
            skillName: skill,
            description: `Develop your ${skill} skills through structured learning, practical exercises and hands-on projects.`,
            duration: '2 weeks',
            priority: index < 2 ? 'High' : 'Medium',
            completed: false,
          }),
        })

        if (!createResponse.ok) {
          throw new Error(
            `Could not add ${skill} to your roadmap.`
          )
        }

        addedCount++
        existingNames.push(normalize(skill))
      }

      setRoadmapMessage(
        `Success! ${completedCount} skills marked completed and ${addedCount} missing skills added to your roadmap.`
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setRoadmapLoading(false)
    }
  }

  const matchPercentage = assessment
    ? assessment.matchPercentage
    : 0

  return (<div className="skill-gap-page">
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
        <span className="section-label">CAREER INTELLIGENCE</span>

        <h1>
          Discover your <span>skill gaps.</span>
        </h1>

        <p className="skill-gap-intro">
          Understand where you stand today and identify the skills
          you need to move closer to your dream career.
        </p>

        <section className="skill-assessment-card">
          <div className="assessment-heading">
            <span className="assessment-number">01</span>
            <div>
              <h2>Choose your target career</h2>
              <p>Select the career you want to pursue.</p>
            </div>
          </div>

          <select
            className="career-select"
            value={career}
            onChange={handleCareerChange}
            disabled={loading || roadmapLoading}
          >
            {Object.keys(careerSkills).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="assessment-heading skills-heading">
            <span className="assessment-number">02</span>
            <div>
              <h2>Select your existing skills</h2>
              <p>
                Choose every skill you currently know.
                Be honest for a more useful assessment.
              </p>
            </div>
          </div>

          <div className="skill-selection-grid">
            {requiredSkills.map((skill) => (
              <label
                className={`skill-option ${
                  selectedSkills.includes(skill) ? 'selected' : ''
                }`}
                key={skill}
              >
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(skill)}
                  onChange={() => handleSkillChange(skill)}
                  disabled={loading || roadmapLoading}
                />

                <span className="skill-check">
                  {selectedSkills.includes(skill) ? '✓' : '+'}
                </span>

                {skill}
              </label>
            ))}
          </div>

          <div className="assessment-bottom">
            <span>
              {selectedSkills.length} of {requiredSkills.length} skills selected
            </span>

            <button
              className="primary-button analyze-button"
              onClick={analyzeSkills}
              disabled={loading || roadmapLoading}
            >
              {loading ? 'Analyzing...' : 'Analyze My Skills →'}
            </button>
          </div>

          {error && (
            <p role="alert" className="assessment-error">
              {error}
            </p>
          )}
        </section>

        {assessment && (
          <section className="skill-results">
            <span className="section-label">
              YOUR ASSESSMENT RESULTS
            </span>

            <h2>Here's your career readiness snapshot.</h2>

            <div className="result-card">
              <div className="result-percentage">
                <strong>{matchPercentage.toFixed(2)}%</strong>
                <span>Skill match</span>
              </div>

              <div className="result-details">
                <h3>{assessment.targetCareer}</h3>

                <p>
                  Your assessment matches {assessment.existingSkills.length}{' '}
                  skills against the career requirements.
                </p>

                <div className="result-progress">
                  <div
                    className="result-progress-value"
                    style={{ width: `${matchPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="result-columns">
              <div className="result-list">
                <h3>✓ Skills you have</h3>

                {assessment.existingSkills.length > 0 ? (
                  assessment.existingSkills.map((skill) => (
                    <p className="skill-have" key={skill}>
                      ✓ {skill}
                    </p>
                  ))
                ) : (
                  <p>No skills selected yet.</p>
                )}
              </div>

              <div className="result-list">
                <h3>＋ Skills to develop</h3>

                {assessment.missingSkills.length > 0 ? (
                  assessment.missingSkills.map((skill) => (
                    <p className="skill-missing" key={skill}>
                      + {skill}
                    </p>
                  ))
                ) : (
                  <p>You've selected all the listed skills!</p>
                )}
              </div>
            </div>

            <div className="roadmap-generation">
              <h3>Ready to improve your skills?</h3>

              <p>
                Turn your identified skill gaps into actionable
                learning goals in your ORYNT Learning Roadmap.
              </p>

              {assessment.missingSkills.length > 0 ? (
                <button
                  className="primary-button"
                  onClick={generateRoadmap}
                  disabled={roadmapLoading}
                >
                  {roadmapLoading
                    ? 'Generating Roadmap...'
                    : 'Generate Learning Roadmap →'}
                </button>
              ) : (
                <p>
                  Congratulations! No missing skills were identified.
                </p>
              )}

              {roadmapMessage && (
                <p className="roadmap-success" role="status">
                  {roadmapMessage}
                </p>
              )}

              {error && (
                <p className="assessment-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <p className="assessment-disclaimer">
              This assessment compares your selected skills against
              ORYNT's configured career requirements. It is not a
              validated measure of professional job readiness.
            </p>
          </section>
        )}

        <section className="skill-assessment-card assessment-history">
          <div className="assessment-heading">
            <span className="assessment-number">03</span>
            <div>
              <h2>Your assessment history</h2>
              <p>Review your previously saved skill assessments.</p>
            </div>
          </div>

          {historyLoading ? (
            <p>Loading your assessment history...</p>
          ) : history.length > 0 ? (
            history.map((item) => (
              <div className="result-card" key={item.id}>
                <div className="result-percentage">
                  <strong>
                    {Number(item.matchPercentage).toFixed(2)}%
                  </strong>
                  <span>Skill match</span>
                </div>

                <div className="result-details">
                  <h3>{item.targetCareer}</h3>
                  <p>
                    Assessment #{item.id} ·{' '}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : 'Date unavailable'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No previous assessments found. Complete your first analysis!</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default SkillGap