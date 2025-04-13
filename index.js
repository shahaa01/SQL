//this is a npm package which will give us fake data which
//will save the time of creating data for our practice purposes.
const { faker } = require('@faker-js/faker'); 

let getRandomUser =  () => {
    return {
      id: faker.string.uuid(),
      username: faker.internet.username(), // before version 9.1.0, use userName()
      email: faker.internet.email(),
      password: faker.internet.password()
    };
  }


  //Lets learn to connect node with mySQL
  //we will use MySQL2 Package which helps to connect node with MySQL
  //lets require it now 
  const mysql = require('mysql2');

  //it connects with the database that we created with SQL workbench
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "sarathi1",
    password: "Sangita@#1020"
  });

    let query = "SHOW TABLES";
    connection.query(query, (err, results) => {
      if(err) {
        return `The error is: ${err.message}`;
      }
      console.log(results); //this is an array which stores objects
      console.log(results.length)
    });

    //the connection doesn't ends by itself - so to end the connection w the database
    connection.end();

console.log("Things are still working");

//Now lets learn to use SQL from CLI instead of using workbench - refer to notes