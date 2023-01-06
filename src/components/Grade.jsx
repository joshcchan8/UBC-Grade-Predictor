import { useEffect, useState } from "react"

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
    useEffect(() => {
        props.getGradeObject(gradeData.id, gradeData)
    }, [gradeData])

    function handleChange(event) {
        const {name, value} = event.target
        setGradeData(prevGradeData => {
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
            <input
                type="text"
                placeholder="Year Session (ex. 2022W)"
                onChange={handleChange}
                name="yearSession"
                value={gradeData.yearSession}
            />
            {/* <button onClick={submitForm}>CALCULATE</button> */}
        </div>
    )
}