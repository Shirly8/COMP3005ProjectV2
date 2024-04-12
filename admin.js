const {performQuery } = require('./db.js');
const {question} = require('./functions.js');

async function createAccount(email, password, firstName, lastName) {
    const command = 'INSERT INTO staff (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)';
    const values = [email, password, firstName, lastName];
    try {
    await performQuery(command, values);
    console.log("\n\nAdmin Added! \n");
    displayAdminMenu();

    }catch (error) {
      console.error("An error occurred:", error);
  }
}


async function login() {
  let email = await question("Enter email: ");
  let password = await question("Enter password: ");

  const command = 'SELECT * FROM staff WHERE email = $1 AND password = $2';
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
  console.log("\STAFF MENU: \n");
  console.log("1 - Room Booking Management");
  console.log("2 - Equipment Maintenance Monitoring");
  console.log("3 - Class Schedule Update");
  console.log("4 - Billing/Payment Processing");
  console.log("0 - Exit");

  let choice = await question("Enter your choice: ", answer => ['1', '2', '3', '4'].includes(answer));
  if (choice == 1) {
    roomBookingManagement();
  } else if (choice == 2){
    equipmentMonitoring(); 
  } else if (choice == 3) {
    classScheduleUpdate();
  }
  else if (choice == 4) {
    processPayment();
  } 
}

async function roomBookingManagement(){
  var choice = await question("\n1 - View Room Bookings \n2 - Update Room Bookings \n3 - Create New Room Booking\n4 - Return to Main Menu\nEnter your choice: ");
  if (choice == 1) {
    const command = `SELECT * from rooms`
    const res = await performQuery(command, '');
    console.log('Location \tBooked Date \tBooked Time \tType of Session');
    res.rows.forEach(session => {
      const bookedDate = new Date(session.start_date);
      const month = bookedDate.getMonth() + 1; 
      const day = bookedDate.getDate();
      const year = bookedDate.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      console.log(`${session.room_location} \t\t${formattedDate} \t${session.start_time}\t${session.event_type}`);   
     });
  } else if (choice == 2) {

  } else if (choice == 3) {

  } else if (choice == 4) {
    displayAdminMenu();
  } roomBookingManagement(); 
}

async function classScheduleUpdate() {
  var choice = await question("\n1 - View Class Schedule \n2 - Update Class Schedule \n3 - Create New Class\n4 - Return to Main Menu\nEnter your choice: ");
  if (choice == 1) {
    const command = 
      `SELECT 
      groupsessions.session_id, 
      trainers.first_name || ' ' || trainers.last_name AS trainer_name, 
      groupsessions.booked_date, 
      groupsessions.booked_time, 
      groupsessions.session_type,
      rooms.room_location
      FROM 
        groupsessions
      JOIN 
        trainers ON groupsessions.trainer_id = trainers.trainer_id
      JOIN
        rooms ON groupsessions.room_id = rooms.room_id;`
    const res = await performQuery(command, '');
    console.log('ID#\tTrainer Name\t\t\tBooked Date\tBooked Time\tType of Session\t\tRoom Location');
    res.rows.forEach(session => {
        const bookedDate = new Date(session.booked_date);
        const month = bookedDate.getMonth() + 1; 
        const day = bookedDate.getDate();
        const year = bookedDate.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;

        // Padding for each column to ensure fixed width
        const paddedSessionId = session.session_id.toString().padEnd(6, ' ');
        const paddedTrainerName = session.trainer_name.padEnd(24, ' ');
        const paddedFormattedDate = formattedDate.padEnd(12, ' ');
        const paddedBookedTime = session.booked_time.padEnd(14, ' ');
        const paddedSessionType = session.session_type.padEnd(20, ' ');

        console.log(`${paddedSessionId}\t${paddedTrainerName}\t${paddedFormattedDate}\t${paddedBookedTime}\t${paddedSessionType}\t${session.room_location}`);  
    }); 
  } else if (choice == 2) {
    let answer = await question('1 - Change Time/Date/Trainer \n2 - Change Session Type\n3 - Change Room\nEnter your choice: ');
    if (answer == 1) groupSessionsUpdateSchedule();
    else if (answer == 2) {
      let groupID = await question('Enter ID# for the group session you want to change: ');
      let sessionType = await question("Enter new group session type: ")
      const commands = `UPDATE groupsessions SET session_type = $1 WHERE session_id = $2 RETURNING room_id;`;
      const value = [sessionType, groupID];
      const result = await performQuery(commands, value);
      const roomID = result.rows[0].room_id;
      const command2 = `UPDATE rooms SET event_type = $1 WHERE room_id = $2`
      const value2 = [sessionType, roomID];
      await performQuery(command2, value2);
    } else if (answer == 3) {
      let groupID = await question("Enter ID# for the group session you want to change: ");
      let location = await question("Enter new room # (ie. Format: Room 7): ")
      let command = `UPDATE rooms
      SET room_location = (
          SELECT $2 AS new_room_location
          FROM rooms
          WHERE room_id = (
              SELECT room_id
              FROM groupsessions
              WHERE session_id = $1 
          )
      )
      WHERE room_id = (
          SELECT room_id
          FROM groupsessions
          WHERE session_id = $1 
      ); `
      let values = [groupID, location]
      performQuery(command, values);
    } 
  } else if (choice == 3) {
    groupsessionsCreate();
  } else if (choice == 4) {
    displayAdminMenu();
  } classScheduleUpdate(); 
}

async function groupSessionsUpdateSchedule(){
  let groupID = await question('Enter ID# for the group session you want to change: ');
  let newDate = await question('Enter the new date for the group session (Format: 04-06-24): ')
  let date = new Date(newDate);
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
    console.log('No availability. Please enter another date');  groupsessionsCreate();
  }
  let number = await question("\nEnter time slots you would like to book?: ");
  let trainerId = trainers[number]; let startTime = times[number];
  const commands = `UPDATE groupsessions SET trainer_id = $1, time_slot_id = $2, booked_date = $3, booked_time = $4 WHERE session_id = $5`;
  const value = [trainerId, number, date, startTime, groupID];
  sessionadded = await performQuery(commands, value);
  classScheduleUpdate(); 
}

async function groupsessionsCreate(){
  let input = await question("Enter the date you want to create group session (Format: 04-06-24): ");

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
    console.log('No availability. Please enter another date');  groupsessionsCreate();
  }
  let number = await question("\nEnter time slots you would like to book?: ");
  let trainerId = trainers[number]; let startTime = times[number];
  let typeOfSession = await question("What type of group session is it?: ")
  const commands = `INSERT INTO groupsessions (trainer_id, time_slot_id, booked_date, booked_time, session_type, room_id) VALUES ($1, $2, $3, $4, $5, $6)`;
  const value = [trainerId, number, date, startTime, typeOfSession, 1];
  sessionadded = await performQuery(commands, value);
  console.log('');
  classScheduleUpdate();
}

async function equipmentMonitoring() {
  var choice = await question("\n1 - View All Equipment\n2 - Add Broken Equipment \n3 - Change Status of Equipment\n4 - to Main Menu\nEnter your choice: ");
  if (choice == 1) { 
    const command = 'SELECT * FROM equipments ORDER BY equipment_id';
    const res = await performQuery(command, '');
    console.log('\nID#\tEquipment\tStatus\tLocation\n===============================================')
    res.rows.forEach((item) => {
      console.log(` ${item.equipment_id}\t${item.equipment_name}\t${item.status}\t${item.room_location}`);
    });;
  } else if (choice == 2) {
    let eName = await question("Enter broken equipment name: ");
    let location = await question("Enter location of broken equipment: ");
    const command = 'INSERT INTO equipments (equipment_name, status, room_location) VALUES ($1, $2, $3)';
    const value = [eName, false, location];
    await performQuery(command, value);
    console.log('Broken Equipment was added');
  } else if (choice == 3) {
    let id = await question("Enter id of equipment you want to change: ");
    let type = await question("Enter status of equipment: ");
    const command = 'UPDATE equipments SET status = $1 WHERE equipment_id = $2';
    const value = [type, id];
    await performQuery(command, value);
    console.log('Equipment status changed');
  } else if (choice == 4) {
    displayAdminMenu();
  }
  equipmentMonitoring();
}

// Error: duplicate key value violates unique constraint "billing_pkey". 
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
