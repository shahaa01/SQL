// This is an NPM package that gives us fake data,
// saving us time when creating test data for practice.
const { faker } = require('@faker-js/faker');

//This returns an object
let getRandomUserObject = () => {
  return {
    id: faker.string.uuid(),
    username: faker.internet.username(), // For versions before 9.1.0, use faker.internet.userName()
    email: faker.internet.email(),
    password: faker.internet.password()
  };
};

//This returns an array
let getRandomUserArray = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // For versions before 9.1.0, use faker.internet.userName()
    faker.internet.email(),
    faker.internet.password()
  ]
};
 
// Let's learn how to connect Node with MySQL.
// We'll use the mysql2 package, which helps us connect to a MySQL database.

// Require necessary packages
const mysql = require('mysql2');
const express = require('express');
const app = express();
const PORT = 8080;

// Create a connection to the MySQL database (created in MySQL Workbench)
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "sarathi",
  password: "Sangita@#1020"
});

// Test if the database is connected
connection.connect((err) => {
  if (err) {
    console.error(`Failed to connect: ${err.message}`);
    return;
  }
  console.log('Database connected successfully 🚀');
});

// Create a GET route to fetch all users (providers in this case)
app.get('/providers', (req, res) => {
  const query = "SELECT * FROM customer";

  connection.query(query, (err, results) => {
    if (err) {
      res.send(`The error is: ${err.message}`);
      return;
    }

    // 'results' is an array of objects, so we can send it directly
    //res.send(results, [1,2,]); 
    // //res.send(body) only accepts one arguements, if you pass multiple - other arguments are ignored by JS
    //to pass multiple arguments you can send a single objects with multiple arrays within it 
    // or send a 2d array
    res.send({
      results: results,
      extras: [1,2,3,4,5]
    });

    // NOTE: You can't use a loop to send multiple responses with res.send(),
    // because res.send can only be called once per request.
  });
});

//creating a test GET route to insert data into the table
app.get('/insertUsers', (req, res) => {
  const query2 = "insert into `user` (id, username, email, password) values (?, ?, ?, ?)";
  const userData = getRandomUserArray(); //this gives random data - we defined this function above
  connection.query(query2, userData, (err, results) => {
    if(err) {
      console.log(`The error is: ${err.message}`);
      return;
    }
    res.send(results);
  })

})


// NOTE: The connection to the database doesn't end automatically.
// You can close it manually if needed using connection.end()
// But we usually keep it open if the app is running and serving multiple requests.

// This line just confirms that the script is running
console.log("Things are still working...");

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});

// Now let's learn how to use SQL from the CLI instead of Workbench — refer to your notes.
