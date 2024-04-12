const {performQuery} = require('./db.js');
const {question} = require('./functions.js');
var savedID = 0; 
const fs = require('fs');

async function createAccount(email, password, firstName, lastName, routine, goals, metrics) {
  try{
    const command = 'INSERT INTO members (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING member_id';
    const values = [email, password, firstName, lastName];
    const userinfo = await performQuery(command, values);
    savedID = userinfo.rows[0].member_id; //GET ID FROM THE MEMBER TABLE

    const command2 = 'INSERT INTO dashboard (member_id, exercise_routines, fitness_goals, health_metrics) VALUES($1, $2, $3, $4)';
    const values2 = [savedID, routine, goals, metrics]
    await performQuery(command2, values2);

    //PRORATED AMOUNT DURING THE FIRST MONTH
    const joinDate = new Date();
    const currentDays = new Date(joinDate.getFullYear(), joinDate.getMonth() + 1, 0).getDate();
    const dueAmount = (60/currentDays) * (currentDays-joinDate.getDate());
    const dueDate = new Date(joinDate.getFullYear(), joinDate.getMonth() + 1, 1);
    
    //CREATE A BILLING RECORD: 
    const billingQuery = 'INSERT INTO billing (member_id, amount, due_date, paid) VALUES ($1, $2, $3, $4)';
    const billingVal = [savedID, dueAmount, dueDate, false];
    await performQuery(billingQuery, billingVal);
    console.log("\n\nMember Added! Your membership is $60/month starting next month. \nThis month you pay the prorated amount of: $" + dueAmount.toFixed(2) + ".\n")
    displayMemberMenu();

  }catch(error){
    console.error("An error occurred:", error);
  }
}


async function login() {
    let email = await question("Enter email: ");
    let password = await question("Enter password: ");
  
    const command = 'SELECT * FROM members WHERE email = $1 AND password = $2';
    const values = [email, password];
    const res = await performQuery(command, values);
  
    if (res && res.rows.length > 0) {
      // Check membership status
       const paymentCommand = 'SELECT * FROM billing WHERE member_id = $1 AND paid = false AND due_date < CURRENT_DATE';
      const paymentValues = [res.rows[0].member_id];
      const paymentRes = await performQuery(paymentCommand, paymentValues);
      if (paymentRes && paymentRes.rows.length > 0) {
        console.log("\n\nSuccessful Login!\nWELCOME " + res.rows[0].first_name + " " + res.rows[0].last_name + "\nYour membership status is: [INACTIVE]. \n Please make payment and try again\n");
        return;
      }
      console.log("\n\nSuccessful Login!\nWELCOME " + res.rows[0].first_name + " " + res.rows[0].last_name + "\nYour membership status is: [ACTIVE]");
      savedID = res.rows[0].member_id;
      displayMemberMenu();
    } else {
      console.log("Login unsuccessful! Please try again.");
      login();
    }
  }
  

async function displayMemberMenu() {
  console.log("\nMEMBER MENU:");
  console.log("1 - Profile Management");
  console.log("2 - DashBoard Display");
  console.log("3 - Schedule Management");
  console.log("0 - Exit");
  
  let choice = await question("Enter your choice: ", answer => ['1', '2', '3',].includes(answer));
  if (choice == 1) {
    manageAccount(); 
  } else if (choice == 2) {
    displayDashboard(); 
  } else if (choice == 3){
    displaySchedule();
  }
}

// displays the member's dashboard to the user 
async function displayDashboard() {
  const command = 'SELECT * FROM dashboard WHERE member_id = $1;';
  const value = [savedID]
  const data = await performQuery(command, value);
  const command2 = 'SELECT * FROM members WHERE member_id = $1;';
  const data2 = await performQuery(command2, value);
  // displays the member's account information 
  console.log("\nDashboard Menu\n=======================")
  data2.rows.forEach((item) => {
    console.log(`MemberID: ${item.member_id}`);
    console.log(`Email: ${item.email}`);
    console.log(`Password: ${item.password}`);
    console.log(`First Name: ${item.first_name}`);
    console.log(`Last Name: ${item.last_name}`);
  });;
  // displays the member's health information 
  data.rows.forEach((item) => {
    console.log(`Exercise Routines: ${item.exercise_routines}`);
    console.log(`Fitness Goals: ${item.fitness_goals}`);
    console.log(`Health Metrics: ${item.health_metrics}`);
  });;
  // goes back to the member menu 
  displayMemberMenu();
}

// member can update their information
async function manageAccount() {
  let choice = await question("PROFILE MENU: \n1 - Update Personal Information \n2 - Update Exercise Routine, Fitness Goals, Health Metrics \n3 - Return to Main Menu \nEnter your choice: ");
  // allows user to update their personal account information 
  if (choice == 1) {
    let answer = await question("1 - Update First Name\n2 - Update Last Name\n3 - Change Email \n4 - Change Password \n5 - Return to Main Menu \nEnter your choice: ");
    if (answer == 1) {
      // changing first name of account
      let newFname = await question('Enter new first name: ');
      const command = 'UPDATE members SET first_name = $1 WHERE member_id = $2';
      const values = [newFname, savedID];
      await performQuery(command, values);
      console.log('First Name was successfully updated');
    } else if (answer == 2) {
      // changing last name of account
      let newLname = await question('Enter new last name: ');
      const command = 'UPDATE members SET last_name = $1 WHERE member_id = $2';
      const values = [newLname, savedID];
      await performQuery(command, values);
      console.log('Last Name was successfully updated');
    } else if (answer == 3) {
      // changing account's email
      let newEmail = await question('Enter new email: ');
      const command = 'UPDATE members SET email = $1 WHERE member_id = $2';
      const values = [newEmail, savedID];
      await performQuery(command, values);
      console.log('Email was successfully updated');
    } else if (answer == 4) {
      // changing account's password
      let newFname = await question('Enter new password: ');
      const command = 'UPDATE members SET password = $1 WHERE member_id = $2';
      const values = [newFname, savedID];
      await performQuery(command, values);
      console.log('Password was successfully updated');
    } 
  } else if (choice == 2) {
    // member can update their own health information 
    let answer = await question("1 - Update Exercise Routine\n2 - Update Fitness Goals\n3 - Update Health Metrics \n4 - Return to Main Menu \nEnter your choice: ");
    if (answer == 1) {
      // changing exercise routine 
      let newRoutine = await question('Enter new exercise routine: ');
      const command = 'UPDATE dashboard SET exercise_routines = $1 WHERE member_id = $2';
      const values = [newRoutine, savedID];
      await performQuery(command, values);
      console.log('Exercise routine was successfully updated');
    } else if (answer == 2) {
      // changing fitness goals
      let newGoal = await question('Enter new fitness goals: ');
      const command = 'UPDATE dashboard SET fitness_goals = $1 WHERE member_id = $2';
      const values = [newGoal, savedID];
      await performQuery(command, values);
      console.log('Fitness goal was successfully updated');
    } else if (answer == 3) {
      // changing health metrics 
      let newMetrics = await question('Enter new health metrics: ');
      const command = 'UPDATE dashboard SET health_metrics = $1 WHERE member_id = $2';
      const values = [newMetrics, savedID];
      await performQuery(command, values);
      console.log('Health Metrics was successfully updated');
    } 
  }
  console.log('Returning to Main Menu');
  displayMemberMenu();
}




async function groupSession() {
  const command = `
  SELECT 
  gs.session_id AS "GroupId", t.first_name || ' ' || t.last_name AS "TrainerName", gs.session_type AS "Type",gs.room_id AS "Room", TO_CHAR(gs.booked_date, 'MM-DD-YY') AS "Date", TO_CHAR(gs.booked_time, 'HH24:MI') AS "Time"
FROM 
  groupsessions gs
  JOIN trainers t ON gs.trainer_id = t.trainer_id;`;

  const result = await performQuery(command);
    
    if (result.rows.length > 0) {
          console.log('\nID | Trainer Name\tClass\tRoom #\tDate\t\tTime\n=============================================================');
      
        for (let row of result.rows){  
          console.log(row.GroupId+ ' - ' + `${row.TrainerName}\t${row.Type}\t${row.Room}\t${row.Date}\t${row.Time}`); 
        }
      }

  let number = await question("\nEnter group session you would like to book? ");
  const insertCommand = `
  INSERT INTO sessionmembers (session_id, member_id)
  VALUES (${number}, ${savedID});`;
  const insertResult = await performQuery(insertCommand);
  if (insertResult.rowCount > 0) {
    console.log("Successfully booked!\n"); displaySchedule();
  }
 
  }




async function personalSession() {
  let input = await question("Enter the date you want to book personal session (Format: 04-06-24): ");

  let date = new Date(input);
  let dayOfWeek = date.getDay();
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dayName = days[dayOfWeek];

  const command = `
  SELECT s.*, t.first_name, t.last_name, t.trainer_id FROM schedule s
  JOIN trainers t ON s.trainer_id = t.trainer_id
  WHERE s.time_slot_id NOT IN (
      SELECT time_slot_id FROM personalsessions WHERE booked_date = $1
      UNION ALL SELECT time_slot_id FROM groupsessions WHERE booked_date = $1
  )
  AND s.days_free = $2;`;
  const values = [date, dayName]
  const result = await performQuery(command, values);
  let trainers = {}; let times = {};
  if (result.rows.length > 0) {
    console.log('\nTRAINER NAME\tTIME SLOT AVAILABILE: \n=========================================');

  for (let row of result.rows){  
    console.log(row.time_slot_id+ ' - ' + `${row.first_name + ' ' + row.last_name}\t${row.start_time + ' - ' + row.end_time}`); 
    trainers[row.time_slot_id] = row.trainer_id; 
    times[row.time_slot_id] = row.start_time;
  }
  } else {
    console.log('No availability. Please enter another date');  personalSession();
  }
  let number = await question("\nEnter time slots you would like to book? ");
  let trainerId = trainers[number]; let startTime = times[number];

    // Insert the new personal session
  const commands = `INSERT INTO personalsessions (member_id, trainer_id, time_slot_id, booked_date, booked_time) VALUES ($1, $2, $3, $4, $5)`;
  const value = [savedID, trainerId, number, date, startTime];
  sessionadded = await performQuery(commands, value);
  console.log('');

  console.log('SESSION BOOKED! RETURNING MAIN MENU\n');   personalSession();
}

async function displaySchedule() {
  const command = fs.readFileSync('./SQL/bookingSessions.sql', 'utf8');
  const values = [savedID];
  const result = await performQuery(command, values);

  console.log('\nID\tTRAINER NAME\tSESSION\t\tDATE[TIME]\n========================================================');
  for (let row of result.rows) {
    let date = new Date(row.booked_date).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: '2-digit'});
    console.log(`${row.session_id}\t${row.first_name} ${row.last_name}\t${row.session_type}\t${date} [${row.start_time}-${row.end_time}]`);
  }

  let action = await question("\nSCHEDULE MENU: \nD - Delete \nR - Reschedule \n1 - Book personal session\n2 - Book Group Session\nB - Back to Member Menu\nSelect an option: ");
  if (action ==1) {
    personalSession();
  }else if (action == 2) {
    groupSession();
  }else if (action == 'D') {
    let id = await question("Enter id to delete: ");
   let success=  await deleteSession(id);
    if (success) {console.log('Deleted! ');  displaySchedule();}
  }else if (action == 'R') {
    let id = await question("Enter id to reschedule: ");
   let success = await deleteSession(id);
   if (success) { await displaySchedule();} 
  displayDashboard();
}else if (action == 'B'){
  displayMemberMenu();
}
  }

async function deleteSession(id) {
  let command = `DELETE FROM personalsessions WHERE session_id = $1`;
  let values = [id];
  result1 = await performQuery(command, values);
  command = `DELETE FROM groupsessions WHERE session_id = $1`;
  result2 = await performQuery(command, values);
  return result1.rowCount > 0 || result2.rowCount > 0;
}

module.exports = { displayMemberMenu, createAccount, login};
