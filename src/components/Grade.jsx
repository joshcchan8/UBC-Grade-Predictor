import { useEffect, useState } from "react"
import { validateNumber } from '../script.js'

// a form for the user to fill out grades in previous courses
export default function Grade(props) {

    const [gradeData, setGradeData] = useState(
        { 
            subject: "",    // "MATH"
            course: "",     // "100"
            grade: "",      // 79
            yearSession: "" // "2022W"
        }
    )

    const [disabled, setDisabled] = useState(true)

    // 0 means empty, 1 means invalid, 2 means valid
    const [inputStatus, setInputStatus] = useState (
        {
            subject: 0,
            course: 0,
            grade: 0,
            yearSession: 0
        }
    )

    // updates the inputStatus and disabled states when gradeData updates
    useEffect(() => {

        let ready = false
        for (const id in gradeData) {
            if (!validateInput(id) || gradeData[id] === "") {
                ready = true
            }
        }
        setDisabled(ready)

        for (const id in gradeData) {
            setInputStatus(prevInputStatus => {
                return {
                    ...prevInputStatus,
                    [id]: gradeData[id] === "" ? 0 : (
                        !validateInput(id) ? 1 : 2
                    )
                }
            })
        }

    }, [gradeData])

    // update the gradeData object when form inputs change
    function handleChange(event) {
        const {name, value} = event.target
        setGradeData(prevGradeData => {
            return {
                ...prevGradeData,
                [name]: value
            }
        })
    }

    // validate the form input before submission
    function validateInput(id) {
        let input = document.getElementById(id)

        if (!input.checkValidity()) {
            return false
        } 
        return true
    }

    // determines the styling of input boxes based on their values
    function determineStyles(id) {
        if (inputStatus[id] === 0) {
            return {
                backgroundColor: "#e6f7ff",
                outline: "2px solid  #0099ff"
            }
        } else if (inputStatus[id] === 1) {
            return {
                backgroundColor: "#ffcccc",
                outline: "2px solid #ff4d4d"
            }
        } else {
            return {
                backgroundColor: "#b3ffb3",
                outline: "2px solid #00b300"
            }
        }
    }

    // submit the gradeData to the app component
    function submitForm(event) {
        event.preventDefault()
        props.submitGradeObject(gradeData)
    }
    
    return (
        <form className="grade--form">
            <div className="grade--inputs">
                <span className="grade--span">
                    <label htmlFor="subject">Enter Subject</label>
                    <input
                        id="subject"
                        type="text"
                        placeholder='ex. "MATH"'
                        onChange={handleChange}
                        name="subject"
                        value={gradeData.subject}
                        pattern="[A-Z]{3,4}"
                        style={determineStyles("subject")}
                    />
                </span>

                <span className="grade--span">
                    <label htmlFor="course">Enter Section</label>
                    <input 
                        id="course"
                        type="text"
                        placeholder='ex. "101"'
                        onChange={handleChange}
                        name="course"
                        value={gradeData.course}
                        pattern="([0-9]{2}[A-Z]{1})|([0-9]{3}[A-Z]?)"
                        style={determineStyles("course")}
                    />
                </span>

                <span className="grade--span">
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
                        style={determineStyles("grade")}
                    />
                </span>

                <span className="grade--span">
                    <label htmlFor="yearSession">Enter Year Session</label>
                    <input
                        id="yearSession"
                        type="text"
                        placeholder='ex. "2022W"'
                        onChange={handleChange}
                        name="yearSession"
                        value={gradeData.yearSession}
                        pattern="[0-9]{4}(W|S){1}"
                        style={determineStyles("yearSession")}
                    />
                </span>
            </div>

            <button id="calculateButton" disabled={disabled} onClick={submitForm}>CALCULATE</button>
        </form>
    )
}