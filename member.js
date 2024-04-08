const {performQuery} = require('./db.js');
const {question} = require('./functions.js');


async function createAccount(email, password, firstName, lastName) {
  try{
    const command = 'INSERT INTO members (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING member_id';
    const values = [email, password, firstName, lastName];
    const userinfo = await performQuery(command, values);
    const id = userinfo.rows[0].member_id; //GET ID FROM THE MEMBER TABLE

    //PRORATED AMOUNT DURING THE FIRST MONTH
    const joinDate = new Date();
    const currentDays = new Date(joinDate.getFullYear(), joinDate.getMonth() + 1, 0).getDate();
    const dueAmount = (60/currentDays) * (currentDays-joinDate.getDate());
    const dueDate = new Date(joinDate.getFullYear(), joinDate.getMonth() + 1, 1);
    
    //CREATE A BILLING RECORD: 
    const billingQuery = 'INSERT INTO billing (member_id, amount, due_date, paid) VALUES ($1, $2, $3, $4)';
    const billingVal = [id, dueAmount, dueDate, false];
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
      console.log("\n\nSuccessful Login!\nWELCOME " + res.rows[0].first_name + "\n");
      
      //CONSIDER CHECKING MEMBERSHIP STATUS BEFORE DISPLAYING
      displayMemberMenu();
    } else {
      console.log("Login unsuccessful! Please try again.");
      login();
    }
  }
  

async function displayMemberMenu() {
  console.log("MEMBER MENU: \n");
  console.log("1 - User Registration");
  console.log("2 - Profile Management");
  console.log("3 - DashBoard Display");
  console.log("4 - Schedule Management");
  console.log("0 - Exit");
  
  let choice = await question("Enter your choice: ", answer => ['1', '2', '3', '4'].includes(answer));
}


module.exports = { createAccount, login};
