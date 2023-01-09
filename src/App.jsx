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
  const [prediction, setPrediction] = useState(0)

  // Gets the grade object from a specific form (matching id) and updates/adds it to the
  function submitGradeObject(object) {
    setGradeObjects(prevGradeObjects => {
      return [...prevGradeObjects, object]
    })
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

  }, [predictionObject, predictionStatus, gradeObjects])

  // If the course prediction changes at any time, then the prediction resets
  useEffect(function() {
    setPrediction(0)
  }, [predictionObject])

  function updatePrediction(object, status) {
    setPredictionObject(object)
    setPredictionStatus(status)
  }

  const gradeElements = gradeObjects.map(object => {
    return (
      <div className="grade-element" key={nanoid()}>
        <p className="course-description">{object.subject + " " + object.course + " " + object.yearSession}</p>
        <p>Grade Received: {object.grade.toString().slice(0, 4)}</p>
      </div>
    )
  })

  async function calculateResult() {
    let grades = []

    for (const key in gradeObjects) {
      const gradeObject = gradeObjects[key]
      const subject = gradeObject.subject
      const course = gradeObject.course
      const grade = gradeObject.grade
      const yearSession = gradeObject.yearSession
      const percUrl = `https://ubcgrades.com/api/v3/grades/UBCV/${yearSession}/${subject}/${course}`

      const pSubject = predictionObject.pSubject
      const pCourse = predictionObject.pCourse
      const gradeUrl = `https://ubcgrades.com/api/v3/course-statistics/distributions/UBCV/${pSubject}/${pCourse}`
      
      let percentile = 0
      let prediction = 0

      try {
        const response = await fetch(percUrl)
        if (response.status === 404) {
          throw new Error("Course does not exist!")
        } else {
          const data = await response.json()
          percentile = calculatePercentile(data, grade)
        }
      } catch (error) {
        console.log(error)
        return
      }

      try {
        const response = await fetch(gradeUrl)
        if (response.status === 404) {
          throw new Error("Course does not exist!")
        } else {
          const data = await response.json()
          prediction = calculateGrade(data, percentile)
        }
      } catch (error) {
        console.log(error)
        return
      }

      grades.push(prediction)
    }
  
    let sum = 0
    for (const i in grades) {
      sum += grades[i]
    }

    const finalPrediction = (sum / grades.length)
    setPrediction(finalPrediction)
  }

  // Determine which label shows at the prediction button
  // 0 = prediction, 1 = missing course info, 2 = missing form info, 3 = ready to predict
  function determineLabel() {
    if (prediction !== 0 && predictionStatus.pSubject === 2 && predictionStatus.pCourse === 2) {
      return 0
    } else if (predictionStatus.pSubject === 0 || predictionStatus.pCourse === 0) {
      return 1
    } else if (predictionStatus.pSubject === 1 || predictionStatus.pCourse === 1) {
      return 2
    } else if (gradeObjects.length === 0) {
      return 3
    } else {
      return 4
    }
  }


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
          <button id="calculate-button" onClick={calculateResult} disabled={!readyToCalculate} className="button">CALCULATE PREDICTION</button>
          {determineLabel() === 0 && <h4 className="prediction-results">Your Predicted Grade for {predictionObject.pSubject + " " + predictionObject.pCourse} is: {prediction.toFixed(1)}%</h4>}
          {determineLabel() === 1 && <label htmlFor="calculate-button" className="empty-warning">*Field in Grade to Predict is Empty</label>}
          {determineLabel() === 2 && <label htmlFor="calculate-button" className="invalid-warning">*Field in Grade to Predict is Invalid</label>}
          {determineLabel() === 3 && <label htmlFor="calculate-button" className="invalid-warning">*Requires At Least One Previous Course Grade</label>}
          {determineLabel() === 4 && <label htmlFor="calculate-button" className="valid">*Ready to Predict!</label>}
        </div>
      </div>
      <div className="listed-courses">
          <h3 className="header">Prediction Based on...</h3>
          {gradeElements}
      </div>
    </div>
  )
}
