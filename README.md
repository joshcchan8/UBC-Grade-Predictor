# UBC-Grade-Predictor

UBC Grade Predictor App built using JavaScript and React JS.

How it works:
  1. The user inputs the courses they took in previous years (subject, course #, and year session) as well as the grade they achieved in that course. 
  2. The app uses the UBC Grades API to find the grade distribution of the previously completed courses and finds what percentile the student achieved in        each class.
  3. Then, the percentiles are averaged into a single percentile over all courses (Ex. 95th percentile in CPSC 221 and 85th percentile in CPSC 121 gives an      average percentile of 90).
  4. Finally, the app uses the API to find the grade distribution for the course that the student wishes to predict their grade for, and matches the            average percentile to a grade (Ex. for CPSC 213, if the 90th percentile was an 87, then that's what the app would return).

Features:
  - Uses the UBC Grades API and previous course grade distributions to most accurately determine grade predictions.
  - Any course can be predicted as long as its data is available via the UBC Grades API.
  - Users can input up to 10 previously completed courses to most accurately predict their grades.
  - Users can clear course list at any time to reset prediction.
  - Predicted score is given as a percentage (up to one decimal place).
  - There is form validation and dynamic styling for empty, invalid, and valid inputs.
  - Buttons are disabled for invalid entries.
