import { useEffect, useState } from "react"

// a form for the user to fill out grades in previous courses
export default function Grade(props) {

    const [gradeData, setGradeData] = useState(
        {
            subject: "",    // "MATH"
            course: "",     // "100"
            grade: "",      // 79
            session: "",    // "W"
            year: ""        // "2022"
        }
    )

    const [yearData, setYearData] = useState([])
    // const [subjectData, setSubjectData] = useState([])
    // const [courseData, setCourseData] = useState([])

    // Get all yearSessions available
    useEffect(() => {
        async function getYearData() {
            const res = await fetch("https://ubcgrades.com/api/v3/yearsessions/UBCV")
            const data = await res.json()
            setYearData(data)
        }
        getYearData()
    }, [])

    function handleChange(event) {
        const {name, value} = event.target
        setGradeData(prevGradeData => {
            return {
                ...prevGradeData,
                [name]: value
            }
        })
    }

    function submitForm(event) {
        event.preventDefault()
        props.getGradeObject(gradeData)
    }

    const yearSelect = yearData.map((entry, index) => {
        return (
            <option key={index} value={entry}>{entry}</option>
        )
    })
    
    return (
        <form className="grade--form">

            {/* <select
                id="year"
                value={gradeData.year}
                onChange={handleChange}
                name="year"
            >
                {yearSelect}
            </select> */}
            <button onClick={submitForm}>CALCULATE</button>
        </form>
    )
}