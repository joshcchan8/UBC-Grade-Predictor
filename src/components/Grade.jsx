import { useEffect, useState } from "react"

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
                backgroundColor: "#ffe6e6",
                outline: "2px solid #ff4d4d"
            }
        } else {
            return {
                backgroundColor: "#e6ffe6",
                outline: "2px solid #00b300"
            }
        }
    }

    // submit the gradeData to the app component
    function submitForm(event) {
        event.preventDefault()
        props.submitGradeObject(gradeData)
        clearGradeData()
    }

    function clearGradeData() {
        setGradeData({
                subject: "",
                course: "",
                grade: "",
                yearSession: ""
            })

        setInputStatus({
                subject: 0,
                course: 0,
                grade: 0,
                yearSession: 0
            })
    }
    
    return (
        <form className="grade--form">
            <div className="grade--inputs">
                <span className="grade--span">
                    <label htmlFor="subject" className="headings">Subject:</label>
                    <input
                        id="subject"
                        type="text"
                        placeholder='Ex. "MATH"'
                        onChange={handleChange}
                        name="subject"
                        value={gradeData.subject}
                        pattern="[A-Z]{3,4}"
                        style={determineStyles("subject")}
                    />
                    {inputStatus["subject"] === 0 && <label htmlFor="subject" className="empty-warning">*Field is Empty</label>}
                    {inputStatus["subject"] === 1 && <label htmlFor="subject" className="invalid-warning">*Invalid Expression Entered</label>}
                    {inputStatus["subject"] === 2 && <label htmlFor="subject" className="valid">Valid!</label>}
                </span>

                <span className="grade--span">
                    <label htmlFor="course" className="headings">Course:</label>
                    <input 
                        id="course"
                        type="text"
                        placeholder='Ex. "100"'
                        onChange={handleChange}
                        name="course"
                        value={gradeData.course}
                        pattern="([0-9]{2}[A-Z]{1})|([0-9]{3}[A-Z]?)"
                        style={determineStyles("course")}
                    />
                    {inputStatus["course"] === 0 && <label htmlFor="course" className="empty-warning">*Field is Empty</label>}
                    {inputStatus["course"] === 1 && <label htmlFor="course" className="invalid-warning">*Invalid Expression Entered</label>}
                    {inputStatus["course"] === 2 && <label htmlFor="course" className="valid">Valid!</label>}
                </span>

                <span className="grade--span">
                    <label htmlFor="grade" className="headings">Grade (%):</label>
                    <input
                        id="grade"
                        type="number"
                        min="0"
                        max="100"
                        step=".1"
                        placeholder='Ex. "80.1"'
                        onChange={handleChange}
                        name="grade"
                        value={gradeData.grade}
                        style={determineStyles("grade")}
                    />
                    {inputStatus["grade"] === 0 && <label htmlFor="grade" className="empty-warning">*Field is Empty</label>}
                    {inputStatus["grade"] === 1 && <label htmlFor="grade" className="invalid-warning">*Invalid Expression Entered</label>}
                    {inputStatus["grade"] === 2 && <label htmlFor="grade" className="valid">Valid!</label>}
                </span>

                <span className="grade--span">
                    <label htmlFor="yearSession" className="headings">Year Session:</label>
                    <input
                        id="yearSession"
                        type="text"
                        placeholder='Ex. "2022W"'
                        onChange={handleChange}
                        name="yearSession"
                        value={gradeData.yearSession}
                        pattern="[0-9]{4}(W|S){1}"
                        style={determineStyles("yearSession")}
                    />
                    {inputStatus["yearSession"] === 0 && <label htmlFor="yearSession" className="empty-warning">*Field is Empty</label>}
                    {inputStatus["yearSession"] === 1 && <label htmlFor="yearSession" className="invalid-warning">*Invalid Expression Entered</label>}
                    {inputStatus["yearSession"] === 2 && <label htmlFor="yearSession" className="valid">Valid!</label>}
                </span>
            </div>

            <button id="addScoreButton" className="button" disabled={disabled} onClick={submitForm}>ADD SCORE</button>
        </form>
    )
}