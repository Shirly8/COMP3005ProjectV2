# 3005 Assignment 3 - Shirley Huang (101185496)

# Students Database
A javascript application that connects to a PostgreSQL database allowing to call CRUD operations (Create, Read, Update, Delete) on the students table containing first name, last name, email and student id

# Demonstration Video
https://youtu.be/z7amN_icAiM  

# Files
- 3005A3.js 
- A3.sql
- package-lock.json and package.json
- README.md

# Installation
1. Clone resporitory: `git clone https://github.com/Shirly8/COMP3005_a3.git`
2. cd 3005Assignment3
3. npm install


# Setup DataBase
1. Open pgAdmin, connect to a PostgreSQL server
2. Create a database called 'A3' - this is where the javascript is connecting to
3. Run the script 'A3.sql' that creates a students table and inserts the initial data

# Running
- You may need to replace username or password if needed
1. node 3005A3.js
2. You will see a menu prompt where you can type 1-5 depending on your request

1 -  Views all students in the database
2 - Creates a new student which you will be prompt to enter first name, last name, email, and enrollment date
3 - Updates student's email where you will be prompt to enter student id, and new email
4- Deletes all information of the student where you will be prompt to enter student id.
0 - Exits the program


