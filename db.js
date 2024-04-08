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
  let result;

  try {
    result = await dbConnect.query(command, values);

  } catch (error) {
    console.error(`\nError: ${error.message}. \n Try again`);
      return executeQuery(command, values, retryCount - 1);
    } finally {
    await dbConnect.end();
  }
  return result;
}


module.exports = { getConnection, performQuery };



