//ALLOWS USERS TO CANCEL OR INVALID INPUT

const readline = require('readline'); //Reads the input


const r = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function question(query, validate) {
  return new Promise((resolve) => {
    const ask = () => {
      r.question(query, (answer) => {
        if (answer === '0') {
          r.close();
          process.exit(0);
        } else if (!validate || validate(answer)) {
          resolve(answer);
        } else {
          console.log('Input incorrect. Try again. \n');
          ask();
        }
      });
    };
    ask();
  });
}

function scheduleValidation(day, time) {
  let [start_time, end_time] = time.split('-');

  if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(day)) {
    throw new Error("Enter a valid day (e.g., 'Mon').");
  }

  let timeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!timeFormat.test(start_time) || !timeFormat.test(end_time)) {  
    throw new Error("Enter a valid time (24 hour format). ");
  }
}





module.exports = { question, scheduleValidation};
