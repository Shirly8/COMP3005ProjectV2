const {performQuery} = require('./db.js');
const {question} = require('./functions.js');
var savedID = 0; 

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
    //schedule management
  }
}

async function displayDashboard() {
  console.log(savedID)
  const command = 'SELECT * FROM dashboard WHERE member_id = $1;';
  const value = [savedID]
  const data = await performQuery(command, value);
  const command2 = 'SELECT * FROM members WHERE member_id = $1;';
  const data2 = await performQuery(command2, value);
  console.log("\nDashboard Menu\n=======================")
  data2.rows.forEach((item) => {
    console.log(`MemberID: ${item.member_id}`);
    console.log(`Email: ${item.email}`);
    console.log(`Password: ${item.password}`);
    console.log(`First Name: ${item.first_name}`);
    console.log(`Last Name: ${item.last_name}`);
  });;
  data.rows.forEach((item) => {
    console.log(`Exercise Routines: ${item.exercise_routines}`);
    console.log(`Fitness Goals: ${item.fitness_goals}`);
    console.log(`Health Metrics: ${item.health_metrics}`);
  });;
  displayMemberMenu();
}

async function manageAccount() {
  let choice = await question("PROFILE MENU: \n1 - Update Personal Information \n2 - Update Exercise Routine, Fitness Goals, Health Metrics \n3 - Return to Main Menu \nEnter your choice: ");
  if (choice == 1) {
    let answer = await question("1 - Update First Name\n2 - Update Last Name\n3 - Change Email \n4 - Change Password \n5 - Return to Main Menu \nEnter your choice: ");
    if (answer == 1) {
      let newFname = await question('Enter new first name: ');
      const command = 'UPDATE members SET first_name = $1 WHERE member_id = $2';
      const values = [newFname, savedID];
      await performQuery(command, values);
      console.log('First Name was successfully updated');
    } else if (answer == 2) {
      let newLname = await question('Enter new last name: ');
      const command = 'UPDATE members SET last_name = $1 WHERE member_id = $2';
      const values = [newLname, savedID];
      await performQuery(command, values);
      console.log('Last Name was successfully updated');
    } else if (answer == 3) {
      let newEmail = await question('Enter new email: ');
      const command = 'UPDATE members SET email = $1 WHERE member_id = $2';
      const values = [newEmail, savedID];
      await performQuery(command, values);
      console.log('Email was successfully updated');
    } else if (answer == 4) {
      let newFname = await question('Enter new password: ');
      const command = 'UPDATE members SET password = $1 WHERE member_id = $2';
      const values = [newFname, savedID];
      await performQuery(command, values);
      console.log('Password was successfully updated');
    } 
  } else if (choice == 2) {
    let answer = await question("1 - Update Exercise Routine\n2 - Update Fitness Goals\n3 - Update Health Metrics \n4 - Return to Main Menu \nEnter your choice: ");
    if (answer == 1) {
      let newRoutine = await question('Enter new exercise routine: ');
      const command = 'UPDATE dashboard SET exercise_routines = $1 WHERE member_id = $2';
      const values = [newRoutine, savedID];
      await performQuery(command, values);
      console.log('Exercise routine was successfully updated');
    } else if (answer == 2) {
      let newGoal = await question('Enter new fitness goals: ');
      const command = 'UPDATE dashboard SET fitness_goals = $1 WHERE member_id = $2';
      const values = [newGoal, savedID];
      await performQuery(command, values);
      console.log('Fitness goal was successfully updated');
    } else if (answer == 3) {
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

module.exports = { displayMemberMenu, createAccount, login};
