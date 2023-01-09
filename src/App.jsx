import { useState, useEffect } from 'react'
import Grade from './components/Grade'
import { nanoid } from 'nanoid'
import { calculatePercentile, calculateGrade } from './script.js'
import './style.css'
import Prediction from './components/Prediction'

export default function App() {

  const [gradeObjects, setGradeObjects] = useState([])            // contains all grade data
  const [predictionObject, setPredictionObject] = useState({      // contains prediction data
    pSubject: "",
    pCourse: ""
  })
  const [predictionStatus, setPredictionStatus] = useState({      // contains status of prediction data
    pSubject: 0,
    pCourse: 0
  })
  const [readyToCalculate, setReadyToCalculate] = useState(false)
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

  // Checks to see if there is a course grade to predict and at least 1 previous course has been entered
  // If this is true, allow the calculate button to be used
  useEffect(function() {

    const subject = predictionObject["pSubject"]
    const course = predictionObject["pCourse"]
    const subjectStatus = predictionStatus["pSubject"]
    const courseStatus = predictionStatus["pCourse"]

    if (gradeObjects.length >= 1 && 
      subject !== "" && subjectStatus === 2 && 
      course !== "" && courseStatus === 2) {
        setReadyToCalculate(true)
    } else {
      setReadyToCalculate(false)
    }

    console.log(predictionObject, predictionStatus)

  }, [predictionObject, predictionStatus, gradeObjects])

  function updatePrediction(object, status) {
    setPredictionObject(object)
    setPredictionStatus(status)
  }

  // Validates that the given object represents a real course (valid URL to API)
  // function validateObject(object) {

  // }

  const gradeElements = gradeObjects.map(object => {
    return (
      <div className="grade-element" key={nanoid()}>
        <p className="course-description">{object.subject + " " + object.course + " " + object.yearSession}</p>
        <p>Grade Received: {object.grade.toString().slice(0, 4)}</p>
      </div>
    )
  })


  return (
    <div className="App">
      <div className="container">
        <div className="prediction">
          <h3 className="header">1. Grade to Predict</h3>
          <p>Enter the subject and course number of the class you want to predict your grade for.</p>
          <Prediction
            updatePrediction={updatePrediction}
          />
        </div>
        <hr className="divider"/>
        <div className="previous-courses">
          <h3 className="header">2. Previous Course Grades</h3>
          <p>Enter the grade you received for a specific class, along with the subject, course and year session.</p>
          <p className="bottom-p">Click the "ADD SCORE" button to include the entered information in the grade prediction.</p>
          <Grade 
            submitGradeObject={submitGradeObject}
          />
        </div>
        <hr className="divider"/>
        <div className="results">
          <h3 className="header">3. Prediction Results</h3>
          <button disabled={!readyToCalculate} className="button">CALCULATE PREDICTION</button>
          {/* <p>{percentile}</p>
          <p>{grade}</p> */}
        </div>
      </div>
      <div className="listed-courses">
          <h3 className="header">Prediction Based on...</h3>
          {gradeElements}
      </div>
    </div>
  )
}
