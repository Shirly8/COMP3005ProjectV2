
//IMPORT THE ENTITIES
const admin = require('./admin.js');
const member = require('./member.js');
const trainer = require('./trainer.js');
const {question} = require('./functions.js');


async function startMenu() {

  let role = await question('\nMAIN MENU: \n============ \nA - Admin \nM - Member \nT - Trainer \n0 - Exit \nGet started by entering a letter : ', answer => ['A', 'M', 'T'].includes(answer.toUpperCase()));
  let choice = await question('\n \n1. Create Account \n2. Login \n0. Exit \nEnter a number: ', answer => ['1', '2', '0'].includes(answer));

  if (choice == '1') {
    createAccount(role);
  } else if (choice == '2') {
    login(role);
  }else {
    console.log('Invalid choice. Please try again.');
    startMenu();
  }
}

async function createAccount(role) {
  let input = await question("\nACCOUNT CREATION: \nEnter your email, password, first name, and last name, separated by comma and a space: \n");
  let userInfo = input.split(", ");
  let email = userInfo[0].trim();
  let password = userInfo[1].trim();
  let firstName = userInfo[2].trim();
  let lastName = userInfo[3].trim();

  if (role === "A") {
    admin.createAccount(email, password, firstName, lastName);
  } else if (role === "M") {
    member.createAccount(email, password, firstName, lastName);
  } else if (role === "T") {
    let schedules = await question("Enter your schedule availability formatted like this: 'Mon 9-11' \n");
    trainer.createAccount(email, password, firstName, lastName, schedules);
  }
}

async function login(role) {
  if (role === "A") {
    admin.login();
  } else if (role === "M") {
    member.login();
  } else if (role === "T") {
    trainer.login();
  }
}

startMenu();
