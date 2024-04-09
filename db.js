//Import pg library
const {Client} = require ('pg');

//Function that connects to the PostgreSQL database:
function getConnection() {

  //Creates new instances of client class from the created database
  return new Client({
    database: 'final',
    user: 'postgres',
    host: 'localhost',
    password: 'password',
    port: 5432,
  });
}

async function performQuery(command, values) {
  const dbConnect = getConnection();
  await dbConnect.connect();
  let performed = false;

  try {
    await dbConnect.query(command, values);
    success = true;

  } catch (error) {
    console.error(`\nError: ${error.message}. Please Try again`);    

    } finally {
    await dbConnect.end();
  }
  return performed;
}


module.exports = { getConnection, performQuery };



