import { useEffect, useState } from "react"
import { validateNumber } from '../script.js'

// a form for the user to fill out grades in previous courses
export default function Grade(props) {

    const [gradeData, setGradeData] = useState(
        {
            id: props.id,   
            subject: "",    // "MATH"
            course: "",     // "100"
            grade: "",      // 79
            yearSession: "" // "2022W"
        }
    )

    // const [yearSessionData, setYearSessionData] = useState([])
    // const [subjectData, setSubjectData] = useState([])
    // const [courseData, setCourseData] = useState([])

    // Get all yearSessions available
    // useEffect(() => {
    //     fetch("https://ubcgrades.com/api/v3/yearsessions/UBCV")
    //         .then(res => res.json())
    //         .then(data => setYearSessionData(data))
    // }, [])

    // send the grade data to the App only when it updates
    // useEffect(() => {
    //     props.getGradeObject(gradeData.id, gradeData)
    // }, [gradeData])

    function handleChange(event) {
        const {name, value, type} = event.target
        setGradeData(prevGradeData => {
            if (type === "number") {
                return {
                    ...prevGradeData,
                    [name]: validateNumber(value)
                }
            }
            return {
                ...prevGradeData,
                [name]: value
            }
        })
    }

    // function submitForm(event) {
    //     event.preventDefault()
    //     props.getGradeObject(gradeData)
    // }
    
    return (
        <div className="grade--inputs">

            <label htmlFor="subject">Enter Subject</label>
            <input
                id="subject"
                type="text"
                placeholder='ex. "MATH"'
                onChange={handleChange}
                name="subject"
                value={gradeData.subject}
            />

            <label htmlFor="course">Enter Section</label>
            <input 
                id="course"
                type="text"
                placeholder='ex. "101"'
                onChange={handleChange}
                name="course"
                value={gradeData.course}
            />

            <label htmlFor="grade">Enter Grade</label>
            <input
                id="grade"
                type="number"
                min="0"
                max="100"
                step=".1"
                placeholder='ex. "80.1"'
                onChange={handleChange}
                name="grade"
                value={gradeData.grade}
            />

            <label htmlFor="yearSession">Enter Year Session</label>
            <input
                id="yearSession"
                type="text"
                placeholder='ex. "2022W"'
                onChange={handleChange}
                name="yearSession"
                value={gradeData.yearSession}
            />

            {/* <button onClick={submitForm}>CALCULATE</button> */}
        </div>
    )
}