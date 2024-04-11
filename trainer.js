const {performQuery } = require('./db.js');
const {question, scheduleValidation, getNextHour, countHour} = require('./functions.js');
var savedID = 0; 


async function updateSchedule(trainer_id, newAcc) {
  try {
    let schedules = '';
    let scheduleArray = [];
    while (true) {
      try {
        schedules = await question("Enter your available time-slot in 60 min increment (24hr clock): 'Monday = 9:00-11:00, Tuesday = 13:30-19:30'\n");
        scheduleArray = schedules.split(', ');
        for(let i = 0; i < scheduleArray.length; i++) {
          let [day, time] = scheduleArray[i].split(' = ').map(s => s.trim());
          scheduleValidation(day, time); 
        }
        break; 
      } catch (error) { 
        console.error(`\nFormat Error: ${error.message}. Please try again! \n`);
      }
    }

    for(let i = 0; i < scheduleArray.length; i++) {
      let [day, time] = scheduleArray[i].split(' = ').map(s => s.trim());
      let [start_time, end_time] = time.split('-').map(t => t.trim());

      let hours = countHour(start_time, end_time);

      for(let j = 0; j < hours; j++) {

      // Check if the record exists
       const checkCommand = 'SELECT * FROM schedule WHERE trainer_id = $1 AND days_free = $2 AND start_time = $3';
       const checkValues = [trainer_id, day, start_time];
       const res = await performQuery(checkCommand, checkValues);
       savedID = trainer_id;
       let command; 

       let nextHour = getNextHour(start_time);

       if (res.rows.length > 0) {
        command = 'UPDATE schedule SET start_time = $3, end_time = $4 WHERE trainer_id = $1 AND days_free = $2';
       }else {
        command = 'INSERT INTO schedule (trainer_id, days_free, start_time, end_time) VALUES ($1, $2, $3, $4)';
       }

      const values = [trainer_id, day, start_time, nextHour];
      await performQuery(command, values);console.log('');
      start_time = nextHour
    }
  }

    if (newAcc) { console.log("\nTrainer Added! \n");  displayTrainerMenu(); }else {console.log("Schedule Updated!");return true}

  } catch(error) {
    console.error(`\nInput Error: ${error.message}. Please try again! \n`); updateSchedule(trainer_id, newAcc);
  }
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
    savedID =  res.rows[0].trainer_id;

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
    scheduleManagement();
    console.log('');

  } else if (choice == 2) {
    membersearching(); 
    console.log('');
  }
}

// FOR LATER - SHOULD THEY BE ABLE TO LOOK AT THEIR FITNESS STATS?
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


async function scheduleManagement() {
  let updated = false;
  console.log("\nSchedule Management");
  console.log("1 - View Schedule" );
  console.log("2 - Update Schedule - [Updating on existing will replace]"); 
  console.log("3 - Delete Schedule [By day]");   
  console.log("4 - Go back to dashboard");  
  let choice = await question("Enter your choice or 0 to Exit: ", answer => ['1', '2', '3', '4'].includes(answer));   console.log('');

  if (choice === '1') {
    const command = `SELECT * FROM schedule WHERE trainer_id = $1 ORDER BY CASE days_free
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END`;
    const values = [savedID];
    const result = await performQuery(command, values);
  
    if (result.rows.length > 0) {
        console.log('CURRENT SCHEDULE \n=====================================');
        let currentDay = '';
        for (let row of result.rows) {
            if (row.days_free !== currentDay) {
                console.log('\n' + row.days_free + ':');
                currentDay = row.days_free;
            }
            // Fetch the session details from personalsessions and groupsessions tables
            const sessionCommand = `SELECT booked_date, 'Personal' as session_type FROM personalsessions WHERE time_slot_id = $1 AND trainer_id = $2
                                    UNION ALL
                                    SELECT booked_date, 'Group' as session_type FROM groupsessions WHERE time_slot_id = $1 AND trainer_id = $2
                                    ORDER BY booked_date`;
            const sessionValues = [row.time_slot_id, savedID];
            const sessionResult = await performQuery(sessionCommand, sessionValues);
            
            let sessionDetails = sessionResult.rows.map(session => `(${session.session_type} - ${new Date(session.booked_date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}), `);
            console.log(row.start_time + ' - ' + row.end_time + ':\t' + sessionDetails);
        }
    } else {
        console.log('NO SCHEDULE');
    }
    scheduleManagement();
}
else if (choice == '2') {
  let updated = await updateSchedule(savedID, false);
  console.log('');
  if (updated) {
    scheduleManagement();
  }
  }
  else if (choice == '3') {
    let day = await question("What day would you like to delete e.g: 'Mon'): "); day = day.charAt(0).toUpperCase() + day.slice(1);
    const command = 'DELETE FROM schedule WHERE trainer_id = $1 AND days_free = $2';
    const values = [savedID, day];
    await performQuery(command, values);
    console.log("Schedule deleted!");
    scheduleManagement();
  }else if (choice == '4') {displayTrainerMenu()}
}


module.exports = { updateSchedule, login, displayTrainerMenu};
