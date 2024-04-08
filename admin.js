const {performQuery } = require('./db.js');
const {question} = require('./functions.js');


async function createAccount(email, password, firstName, lastName) {
    const command = 'INSERT INTO administrativestaff (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)';
    const values = [email, password, firstName, lastName];
    await performQuery(command, values);

    console.log("\n\nAdmin Added! \n");
    displayAdminMenu();
}


async function login() {
  let email = await question("Enter email: ");
  let password = await question("Enter password: ");

  const command = 'SELECT * FROM administrativestaff WHERE email = $1 AND password = $2';
  const values = [email, password];
  const res = await performQuery(command, values);

  if (res && res.rows.length > 0) {
    console.log("\n\nSuccessful Login!\nWELCOME " + res.rows[0].first_name + "\n");
    displayAdminMenu();
  } else {
    console.log("Login unsuccessful! Please try again.");
    login();
  }
}

async function displayAdminMenu() {
  console.log("ADMINISTRATION MENU: \n");
  console.log("1 - Room Booking Management");
  console.log("2 - Equipment Maintenance Monitoring");
  console.log("3 - Class Schedule Update");
  console.log("4 - Billing/Payment Processing");
  console.log("0 - Exit");

  let choice = await question("Enter your choice: ", answer => ['1', '2', '3', '4'].includes(answer));
}





module.exports = { createAccount, login};
