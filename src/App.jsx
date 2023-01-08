import { useState, useEffect } from 'react'
import Grade from './components/Grade'
import { nanoid } from 'nanoid'
import { calculatePercentile, calculateGrade } from './script.js'
import './style.css'

export default function App() {

  const [gradeObjects, setGradeObjects] = useState([])    // contains all grade data
  const [percentile, setPercentile] = useState(0)
  const [grade, setGrade] = useState(0)

  // TEST Variables
  let section = "92C"
  let subject = "MATH"
  let course = "100"
  let score = 59

  // For grade distributions: /api/v3/grades/UBCV/2022S/MATH/100/92C
  // *** this returns the distribution for a specific section ***
  // We need to get:
  // - the year they took the course
  // - the section they took the course in
  // - the grade they got in the course (percentage)
  // This is for determining the percentile a student got in the class when they took it
  useEffect(function() {
    fetch(`https://ubcgrades.com/api/v3/grades/UBCV/2022S/${subject}/${course}/${section}`)
      .then(response => response.json())
      .then(data => setPercentile(calculatePercentile(data, score)))
  }, [])

  // TEST Variables
  let subject2 = "COMM"
  let course2 = "101"
  let perc = 79

  // For predicting grades: /api/v3/grades/UBCV/2022S/MATH/100
  // *** this returns an array of grade distributions for all sections ***
  // - perc: the cumulative percentile that the student has achieved in previous (similar) courses
  // - data: array of all grade distribution data
  useEffect(function() {
    fetch(`https://ubcgrades.com/api/v3/course-statistics/distributions/UBCV/${subject2}/${course2}`)
      .then(response => response.json())
      .then(data => setGrade(calculateGrade(perc, data)))
  }, [])

  // Gets the grade object from a specific form (matching id) and updates/adds it to the
  function submitGradeObject(object) {
    // if (validateObject(object)) {
      setGradeObjects(prevGradeObjects => {
        return [...prevGradeObjects, object]
      })
    // }
  }

  // Validates that the given object represents a real course (valid URL to API)
  // function validateObject(object) {

  // }

  const gradeElements = gradeObjects.map(object => {
    return (
      <div key={nanoid()}>
        <p>{object.subject}</p>
        <p>{object.course}</p>
        <p>{object.grade}</p>
        <p>{object.yearSession}</p>
      </div>
    )
  })


  return (
    <div className="App">
      <Grade 
        submitGradeObject={submitGradeObject}
      />
      {gradeElements}
      <p>{percentile}</p>
      <p>{grade}</p>
    </div>
  )
}
