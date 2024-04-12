# 3005 FINAL PROJECT V2- Shirley Huang (101185496) AND Helen Zhu (101260141)

# Students Database

# Demonstration Video

# Files
**SQL FOLDER:**
<br/> DML.sql - creates table 
<br/>  DDL.sql - inserts data into table
<br/> BookingSessions.sql - to run a query for members to book a personal or group session 

<br/> admin.js - administrative staff functions 
<br/> db.js - setup database 
<br/> function.js - error handling with improper user input
<br/> main.js - main menu, starts code
<br/> member.js - member functions
<br/> package-lock.json - used for npm install to run the code
<br/> package.json - used for npm install to run the code 
<br/> README.md 
<br/> trainer.js - trainer functions

# Installation
To download all the files in the repository, execute the following command in the terminal: 
```
git clone https://github.com/Shirly8/COMP3005ProjectV2.git 
```

# Setup DataBase
Open .db.js file and look for the getConnection() function and update the following information with your own. 
```
database: 'final',
user: ' ',
host: 'localhost',
password: '',
port: 5432,
```
# Running
To run the program execute the following commands in the terminal:
```
npm install 
node main.js
```