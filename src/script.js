// calculates the percentile based on the given score a student achieved in a course
function calculatePercentile(data, score) {

    let percentileArr = [] 
    for (const key in data) {

        let entry = data[key]

        // If score is less than 50%
        if (score < 50) {
            return entry.grades["<50%"] === "" ? 1 : entry.grades["<50%"] / entry.reported
        }

        // Score is greater than or equal to 50%
        let lowerScores = 0
        let bounds = ""

        for (const range in entry.grades) {
            if (typeof entry.grades[range] === "string") {
                continue
            } else if (range[0] === "<") {
                lowerScores += entry.grades[range]
            } else {
                if (score > parseInt(range.slice(3, -1)) + 0.49) {
                    lowerScores += entry.grades[range]
                } else if (parseInt(range.slice(0, 2)) - 0.5 <= score &&
                    score <= parseInt(range.slice(3, -1)) + 0.49) {
                    bounds = range
                }
            }
        }

        // Calculate percentile
        let percentile = 0

        if (bounds !== "" && entry.grades[bounds] !== "") {
            let upperBound = parseInt(bounds.slice(3, -1)) + 0.49
            let lowerBound = parseInt(bounds.slice(0, 2)) - 0.5
            let boundedScore = ((score - (lowerBound)) / (upperBound - lowerBound)) * entry.grades[bounds]
            percentile = ((lowerScores + boundedScore) / entry.reported) * 100
        } else {
            percentile = (lowerScores / entry.reported) * 100
        }

        percentileArr.push(percentile)
    }

    // calculate average of all section percentiles and return
    let sum = 0
    for (const i in percentileArr) {
        sum += percentileArr[i]
    }

    const finalPercentile = sum / percentileArr.length
    return  finalPercentile
}


// calculates the grade a student should get in a class based on the given percentile
function calculateGrade(data, percentile) {

    // use the 5 most recent entries, or all entries if less than 5 exist
    let maximum = Math.max(data.length - 5, 0)
    let recentFive = data.slice(maximum)
    let totalScore = 0

    // find grades corresponding to the percentile over the five entries, and find the average grade
    for (const item in recentFive) {

        let entry = recentFive[item]
        let reported = 0

        // count the total number of students in the entry
        for (const range in entry.grades) {
            reported += typeof entry.grades[range] === "string" ? 0 : entry.grades[range]
        }
        
        // for each entry, find the grade that corresponds to the given percentile
        let studentPercentile = (percentile / 100) * reported
        let studentCounter = 0
        let bounds = ""
        let grade = 0

        if (entry.grades["<50%"] >= studentPercentile) {
            grade = (studentPercentile / entry.grades["<50%"]) * 49.49
            return grade
        } else {
            studentCounter += entry.grades["<50%"]
        }

        // sum the number of students who should get lower scores
        for (const range in entry.grades) {
            if (typeof entry.grades[range] === "string") {
                continue
            } else if (studentCounter + entry.grades[range] >= studentPercentile) {
                bounds = range
                break
            } else {
                studentCounter += entry.grades[range]
            }
        }

        // calculate grade for current session corresponding to the given percentile
        let remaining = studentPercentile - studentCounter
        let boundedPercentage = remaining / entry.grades[bounds]
        let upperBound = parseInt(bounds.slice(3, -1)) + 0.49
        let lowerBound = parseInt(bounds.slice(0, 2)) - 0.5

        grade = (boundedPercentage * (upperBound - lowerBound)) + lowerBound
        totalScore += grade
    }

    // calculate the average grade over all five years corresponding to the given percentile
    let averageGrade = totalScore / recentFive.length
    return averageGrade
}


export { calculatePercentile, calculateGrade }
