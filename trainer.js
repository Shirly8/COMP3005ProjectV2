const {performQuery } = require('./db.js');
const {question} = require('./functions.js');


async function createAccount(email, password, firstName, lastName, schedules) {
    const command = 'INSERT INTO trainers (email, password, first_name, last_name, schedule) VALUES ($1, $2, $3, $4, $5)';
    const values = [email, password, firstName, lastName, schedules];
    await performQuery(command, values);

    console.log("\nTrainer Added! \n");
    displayTrainerMenu();
}


async function login() {
  let email = await question("Enter email: ");
  let password = await question("Enter password: ");

  const command = 'SELECT * FROM trainers WHERE email = $1 AND password = $2';
  const values = [email, password];
  const res = await performQuery(command, values);

  if (res && res.rows.length > 0) {
    console.log("\n\nSuccessful Login!\nWELCOME " + res.rows[0].first_name  + " " + res.rows[0].last_name + "\n");
    displayTrainerMenu();
  } else {
    console.log("Login unsuccessful! Please try again.");
    login();
  }
}

async function displayTrainerMenu() {
  console.log("\nTRAINER MENU: \n");
  console.log("1 - Schedule Management");
  console.log("2 - Member Profile Viewing" );
  console.log("0 - Exit");

  let choice = await question("Enter your choice or 0 to Exit: ", answer => ['1', '2'].includes(answer));
  if (choice == 1) {
    // schedule management 
  } else if (choice == 2) {
    membersearching(); 
  }
}
async function membersearching(){
  let fullName = await question("Enter Member's Name: ");
  const flname = fullName.split(" ")
  const command = 'SELECT * FROM members WHERE first_name = $1 AND last_name = $2';
  const data = await performQuery(command, flname);
  try {
    if (data.rows.length > 0) {
      data.rows.forEach((item) => {
        console.log(`\nMemberID: ${item.member_id}`);
        console.log(`Email: ${item.email}`);
        console.log(`First Name: ${item.first_name}`);
        console.log(`Last Name: ${item.last_name}`);
      });;
    } else {
      console.log("Unable to find specified member")
    }
} catch (error) { // another error message gets printed, needs to be fixed..? from perform query
  console.log("Unable to find specified member")
}
  displayTrainerMenu();
}



module.exports = { createAccount, login, displayTrainerMenu};
