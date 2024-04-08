const {performQuery} = require('./db.js');
const {question} = require('./functions.js');


async function createAccount(email, password, firstName, lastName) {
    const command = 'INSERT INTO members (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)';
    const values = [email, password, firstName, lastName];
    const userinfo = await performQuery(command, values);
    // const id = userinfo.rows[0].id; //GET ID OF THE MEMBER

    //FOR MEMBERSHIP TABLE: 
    // const membershipQuery = 'INSERT INTO memberships (member_id, amount, paid, DueDate) VALUES ($1, $2, $3, $4)'
    // const due = new Date();
    // due.setMonth(due.getMonth()+1)
    // const membershipVal = [id, 60, false, due];
    // await performQuery(membershipQuery, membershipVal);

    console.log("\n\nMember Added! \n");

    displayMemberMenu();
}


async function login() {
    let email = await question("Enter email: ");
    let password = await question("Enter password: ");
  
    const command = 'SELECT * FROM members WHERE email = $1 AND password = $2';
    const values = [email, password];
    const res = await performQuery(command, values);
  
    if (res && res.rows.length > 0) {
      console.log("\n\nSuccessful Login!\nWELCOME " + res.rows[0].first_name + "\n");
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
