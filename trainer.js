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
    console.log("\n\nSuccessful Login!\nWELCOME " + res.rows[0].first_name + "\n");
    displayTrainerMenu();
  } else {
    console.log("Login unsuccessful! Please try again.");
    login();
  }
}

async function displayTrainerMenu() {
  console.log("TRAINER MENU: \n");
  console.log("1 - Schedule Management");
  console.log("2 - Member Profile Viewing" );
  console.log("0 - Exit");

  let choice = await question("Enter your choice or 0 to Exit: ", answer => ['1', '2'].includes(answer));
}



module.exports = { createAccount, login};
