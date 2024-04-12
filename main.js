//IMPORT THE ENTITIES
const admin = require('./admin.js');
const member = require('./member.js');
const trainer = require('./trainer.js');
const {question} = require('./functions.js');
const{performQuery} = require('./db.js')
const fs = require('fs');

async function startMenu() {
  // Read SQL file to create table and insert data
  const table = fs.readFileSync('DDL.sql', 'utf8');
  await performQuery(table, '');

  const dataInsert = fs.readFileSync('DML.sql', 'utf8');
  await performQuery(dataInsert, '');

  let role = await question('\nMAIN MENU: \n============ \nA - Admin \nM - Member \nT - Trainer \n0 - Exit \nGet started by entering a letter : ');
  let choice = await question('\n \n1. Create Account \n2. Login \n0. Exit \nEnter a number: ', answer => ['1', '2', '0'].includes(answer));

  role = role.toUpperCase(); 
  if (choice == '1') {
    createAccount(role);
  } else if (choice == '2') {
    login(role);
  }else {
    console.log('Invalid choice. Please try again.');
    startMenu();
  }
}

//DO WE NEED TO TROUBLESHOOT, IF THEY ENTERED A DUPLICATE ACCOUNT OR WRONG DATA SINCE IT CAUSES A BAD CRASH
async function createAccount(role) {
  let input = await question("\nACCOUNT CREATION: \nEnter your email, password, first name, and last name, separated by comma and a space: \n");
  let email, password, firstName, lastName;
  try {
  let userInfo = input.split(", ");
  email = userInfo[0].trim();
  password = userInfo[1].trim();
  firstName = userInfo[2].trim();
  lastName = userInfo[3].trim();
  }catch (error) {
    console.log("Wrong Input. Try again \n");
    createAccount(role)
    }
  if (role === "A") {
   admin.createAccount(email, password, firstName, lastName);
  } else if (role === "M") {
      let routine = await question("Enter your exercise routines: ");
      let goals = await question("Enter your fitness goals:  ");
      let metrics = await question("Enter your health metrics: ");
      console.log('');
    member.createAccount(email, password, firstName, lastName, routine, goals, metrics);
  }
  
  else if (role === "T") {    
    let trainer_id;

    try {
      const command = 'INSERT INTO trainers (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *';    const values = [email, password, firstName, lastName];
    userinfo = await performQuery(command, values);
    trainer_id = userinfo.rows[0].trainer_id; //GET ID FROM THE MEMBER TABLE
    console.log('');
    }catch(error) {
      console.log('Something wrong... Please try again! \n'); createAccount(role);
    }

        console.log(''); // need this to make the promise stop pending 

    trainer.updateSchedule(trainer_id, true);
  }
}

function login(role) {
  if (role === "A") {
    admin.login();
  } else if (role === "M") {
    member.login();
  } else if (role === "T") {
    trainer.login();
  }
}

startMenu();