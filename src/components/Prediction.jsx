import { useEffect, useState } from "react"

// a form for the user to describe the course they want to predict their grade for
export default function Prediction(props) {

    const [gradeData, setGradeData] = useState(
        { 
            pSubject: "",    // "MATH"
            pCourse: ""     // "100"
        }
    )

    const [disabled, setDisabled] = useState(true)

    // 0 means empty, 1 means invalid, 2 means valid
    const [inputStatus, setInputStatus] = useState (
        {
            pSubject: 0,
            pCourse: 0,
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

    // updates the status of the calculation button based on validity of inputs
    useEffect(() => {
        props.updatePrediction(gradeData, inputStatus)
    }, [gradeData, inputStatus]) 

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
    //  function submitForm(event) {
    //     event.preventDefault()
    //     props.submitGradeObject(gradeData)
    //     clearGradeData()
    // }

    // function clearGradeData() {
    //     setGradeData({
    //             pSubject: "",
    //             pCourse: "",
    //         })

    //     setInputStatus({
    //             pSubject: 0,
    //             pCourse: 0,
    //         })
    // }


    return (
        <div className="prediction--inputs">
            <span className="prediction--span">
                <label htmlFor="pSubject" className="headings">Subject:</label>
                <input
                    id="pSubject"
                    type="text"
                    placeholder='Ex. "MATH"'
                    onChange={handleChange}
                    name="pSubject"
                    value={gradeData.pSubject}
                    pattern="[A-Z]{3,4}"
                    style={determineStyles("pSubject")}
                />
                {inputStatus["pSubject"] === 0 && <label htmlFor="pSubject" className="empty-warning">*Field is Empty</label>}
                {inputStatus["pSubject"] === 1 && <label htmlFor="pSubject" className="invalid-warning">*Invalid Expression Entered</label>}
                {inputStatus["pSubject"] === 2 && <label htmlFor="pSubject" className="valid">Valid!</label>}
            </span>

            <span className="prediction--span">
                <label htmlFor="pCourse" className="headings">Course:</label>
                <input 
                    id="pCourse"
                    type="text"
                    placeholder='Ex. "100"'
                    onChange={handleChange}
                    name="pCourse"
                    value={gradeData.pCourse}
                    pattern="([0-9]{2}[A-Z]{1})|([0-9]{3}[A-Z]?)"
                    style={determineStyles("pCourse")}
                />
                {inputStatus["pCourse"] === 0 && <label htmlFor="pCourse" className="empty-warning">*Field is Empty</label>}
                {inputStatus["pCourse"] === 1 && <label htmlFor="pCourse" className="invalid-warning">*Invalid Expression Entered</label>}
                {inputStatus["pCourse"] === 2 && <label htmlFor="pCourse" className="valid">Valid!</label>}
            </span>
        </div>
    )
}


