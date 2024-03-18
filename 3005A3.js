// Shirley Huang - 101185496
//Step 1: Go into pgAdmin4 and create databse titled A3
//Step 2: insert script "A3.sql" into the database that creates the students table
//Step 3: Install Node.js and npm
//Step 4: Install pg library using npm install on the terminal

//UPDATED: ADDED A TRY CATCH STATEMENT TO CATCH RRORS: 


//Import pg library
const {Client} = require ('pg');

//Function that connects to the PostgreSQL database:
function getConnection() {

  //Creates new instances of clietn class from the created database
  return new Client( {
    database: 'A3',
    user: 'postgres',
    host: 'localhost',
    password: 'password',
    port: 5432,
  });
}

//Function that retrieves all students 
async function getAllStudents() {
  //Connect to database
  const dbConnect = getConnection();
  await dbConnect.connect();

  //Exectue SQL query and print
  const res = await dbConnect.query('SELECT * FROM students');
  console.log(res.rows);

  await dbConnect.end();
  
}

//Function adds students with the indicated columns
async function addStudent(first_name, last_name, email, enrollment_date) {
  
  try {
  //Connect to the database
  const dbConnect = getConnection();
  await dbConnect.connect();
  
  //Execute SQL query by adding specified row informaiton
  const command = 'INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES ($1, $2, $3, $4)';
  const values = [first_name, last_name, email, enrollment_date];
  await dbConnect.query(command,values);

  console.log("\n\nStudent Added! \n")

  await dbConnect.end();
  }catch (error){
    console.error(`\nError: ${error.message}. \nPlease try again with proper input`);
    main();
  }
}


//Function changes student's emails with specified new email
async function updateStudentEmail(student_id, new_email) {

  try {
  //Connect to the database
  const dbConnect = getConnection();
  await dbConnect.connect();

  //Execute SQL query by setting existing email with changed email
  const command = 'UPDATE students SET email = $1 WHERE student_id = $2';
  const values = [new_email, student_id];
  await dbConnect.query(command, values);

  await dbConnect.end();

  console.log("\n\nEmail Updated! \n")
  }catch (error) {
    console.error(`\nError: ${error.message}. \nPlease try again with proper input`);
    main();
  }
}

//Function deletes student with given studentID
async function deleteStudent(student_id) {

  try {
  //Connect to the databse
  const dbConnect = getConnection();
  await dbConnect.connect();

  //Execute SQL query by deleting students with existing id 
  const command = 'DELETE FROM students WHERE student_id = $1';
  const values = [student_id];
  await dbConnect.query(command, values);

  console.log("\n\nStudent Deleted! \n")
  
  await dbConnect.end();
  }catch (error) {
    console.error(`\nError: ${error.message}. \nPlease try again with proper input`);
    main();
  }
}

//Creates variables that allows inputs and reading lines
const readline = require ('readline');
const r = readline.createInterface( {
  input: process.stdin,
  output: process.stdout
});


//Main that prompts users to enter their information
function main() {
  console.log('\nMENU: ');
  console.log('1 - Get all students');
  console.log('2 - Add students');
  console.log('3 - Update students email');
  console.log('4 - Delete student');
  console.log('5 - Exit');

  r.question('\nChoose from above: ', function (option) {
    switch (option) {
      case '1':
        getAllStudents().then(() => main());
        break;

      case '2':
        r.question(
          'Please enter the following separated by comma and space - (first name, last name, email, enrollment date (YYYY-MM-DD)): \n',
          function (info) {
            let [first_name, last_name, email, enrollment_date] =
              info.split(', ');
            addStudent(first_name, last_name, email, enrollment_date).then(() => main()
            );}
        );
        break;

      case '3':
        r.question(
          'Please enter the following separated by comma and space - (id, new email): \n',
          function (info) {
            let [id, new_email] = info.split(', ');
            updateStudentEmail(id, new_email).then(() => main());
          });
        break;

      case '4':
        r.question('Enter the student ID to delete: ', function (id) {
          deleteStudent(id).then(() => main());
        });
        break;

      case '5':
        console.log('Exiting...');
        process.exit(0);
        break;

      default:
        console.log('Invalid option');
        main();
        break;
    }
  });
}
//Call the main program
main(); 