const {performQuery } = require('./db.js');
const {question} = require('./functions.js');


async function createAccount(email, password, firstName, lastName) {
    const command = 'INSERT INTO administrativestaff (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)';
    const values = [email, password, firstName, lastName];
    const success = await performQuery(command, values);

    console.log("\n\nAdmin Added! \n");
    displayAdminMenu();
    return success;
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
  console.log("\nADMINISTRATION MENU: \n");
  console.log("1 - Room Booking Management");
  console.log("2 - Equipment Maintenance Monitoring");
  console.log("3 - Class Schedule Update");
  console.log("4 - Billing/Payment Processing");
  console.log("0 - Exit");

  let choice = await question("Enter your choice: ", answer => ['1', '2', '3', '4'].includes(answer));
  if (choice == 4) {
    processPayment();
  }}


async function seePayment() {
  //Get all bills that are unpaid
  const command = 'SELECT * FROM billing WHERE paid = false';
  const unpaid = await performQuery(command);

  console.log("MemberId\tDue_Date\tAmount\n=========================================");
  for (let bill of unpaid.rows) {
    let date = new Date(bill.due_date)
    let format = (date.toLocaleString('default', { month: 'long' }) + "-" + date.getDate() + "-" + date.getFullYear()).padEnd(15);
    let memberId = bill.member_id.toString().padEnd(8);
    console.log(`${memberId}\t${format}\t$${bill.amount.toFixed(2)}`);
}
}

//IN PROCESS PAYMENT: IF DUE DATE IS DUE, REUPDATE MEMBER'S DUE DATE
async function processPayment() { 

  while(true){
    await seePayment();

  let id = await question("\nEnter MemberId for processing, 'D' for done or 'S' to see new unprocessed payment): ");
  if (id.toUpperCase() === 'D') {
    break;
  }else if (id.toUpperCase() === 'S') {
    continue;
  }else {
    const payment = 'UPDATE billing SET paid = true WHERE member_id = $1';
    const paymentValues = [id];
    const res = await performQuery(payment, paymentValues);
  
    if (res.rowCount === 0) {
      console.log(`Invalid MemberId. Please try again`);
      processPayment();
  } else {
      console.log(`Processed payment for member ${id}!`);

      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth()+2, 1);
      const billingQuery = 'INSERT INTO billing (member_id, amount, due_date) VALUES ($1, $2, $3)';
      const billingVal = [id, 60, dueDate];
      await performQuery(billingQuery, billingVal);
  }
  }
}

displayAdminMenu();

}

module.exports = { createAccount, login};
