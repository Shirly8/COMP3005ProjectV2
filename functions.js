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

module.exports = { question};
