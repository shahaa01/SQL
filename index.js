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
const path = require('path'); 
const methodOverride = require('method-override');

//setting ejs as view engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

//for static files like css, js use this middleware
app.use(express.static(path.join(__dirname, 'public')));

//to use `POST` method in form and to encode the data in req.body use this middleware
app.use(express.urlencoded({extended: true}));

//to use patch, delete, put
app.use(methodOverride('_method'));

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
app.get('/testproviders', (req, res) => {
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

app.get('/insertBulkUsers', (req, res) => {
  const query = "insert into `user` (id, username, email, password) values ?";
  let users = [];
  for(let i = 0; i < 100; i++) {
    users.push(getRandomUserArray());
  }

  connection.query(query, [users], (err, results) => {
    if(err) {
      console.log(`The error is ${err.message}`);
      return;
    }
    else {
      res.send(results);
    }
  })

})


// NOTE: The connection to the database doesn't end automatically.
// You can close it manually if needed using connection.end()
// But we usually keep it open if the app is running and serving multiple requests.

// This line just confirms that the script is running
console.log("Things are still working...");

// Now let's learn how to use SQL from the CLI instead of Workbench — refer to your notes.

//Lets implement RESTful APIs here and create meaningful routes
//home route to show number of users in database
app.get('/', (req, res) => {
  let q = `SELECT count(*) from user`;

  connection.query(q, (err, results) => {
    if(err) {
      console.log(`The error is: ${err.message}`);
      res.send('Some error occured, sorry for inconvenience');
      return;
    }

    let count = 'count(*)';
    res.render('home', {userCount: results[0][count]}); //results is an array which contains object

  })
});

//users route to see all the users
app.get('/users', (req, res) => {
  let q = `SELECT * from user`;

  connection.query(q, (err, results) => {
    if(err) {
      errorMessage(err);
      res.send('Some error occured, sorry for inconvenience');
      return;
    }
    
    res.render('users', {allUsersInfo : results});
  })
});

//route to a form when clicked on 'edit username' button
app.get('/usernameForm/:id', (req, res) => {
  const userId = req.params.id; //req.params is an object that stores route parameters from URL - These are the : parts in your route.
  let q = "SELECT * from `user` where id = ?";

  connection.query(q, [userId], (err, results) => {
    //connection.query expects its 2nd parameter to be an array or object of values
    if(err) {
      errorMessage(err);
      res.send("Sorry");
      return;
    }

    res.render('usernameForm', {user: results[0]});
  })  

});

//route to post the info that is to update the username and to redirect to users route
app.patch('/usernameForm/:id', (req, res) => {
  let userId = req.params.id;
  let q = "update `user` set `username` = ?  where `id` = ?";
  let newUsername = req.body.newUsername;

  connection.query(q, [newUsername, userId], (err, results) => {
    if(err) {
      errorMessage(err);
      res.send("Sorry");
      return;
    }

    res.redirect('/users');
  })
  
});

//route for a form to fill in info for new user
app.get('/newUser', (req, res) => {
  res.render('newUser')
});

//post route for a form to post its data
app.post('/newUser', (req, res) => {
  let username = req.body.username;
  const userId = faker.string.uuid();
  let email = req.body.email;
  let password = req.body.password;
  let userData = [[userId, username, email, password]]; //for single placeholders 

  let usernameExists = false;
  let emailExists = false;

  let q = "INSERT into `user`(id, username, email, password) values ?"
  let uniqueValidationQuery = "SELECT * from `user` where `username` = ? OR `email` = ?";

  connection.query(uniqueValidationQuery, [username, email], (err, results) => {
    if(err) {
      res.send(errorMessage(err));
      return;
    }


    results.forEach((rows) => {
      if(rows.username === username) usernameExists = true;
      if(rows.email === email) emailExists = true;
    });

    if(usernameExists && emailExists) {
      res.send("Both username and email already exists.")
    }
    else if(usernameExists) res.send("Username already exists.");
    else if(emailExists) res.send("Email already exists.");
    else {
      connection.query(q,[userData] , (err, results) => {
        if(err) {
          res.send(errorMessage(err));
          return;
        }
    
        res.redirect('/users');
      })
    }  
  });
});

//route that asks for pw from user to delete post or edit username
app.get('/authUser/:id', (req, res) => {
  const id = req.params.id; //req.params is an object which holds all the parameters inside one object -> Key:Value 
  let q = "SELECT * from `user` where `id` = ?";

  connection.query(q, [id], (err, results) => {
    if(err) {
      res.send(errorMessage(err));
      return;
    }

    res.render('authentication', {user: results[0]});
  })
});

//route to delete any user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const pw = req.body.password;
  let q = "DELETE from `user` where `id` = ? AND `password` = ?";

  connection.query(q, [userId, pw], (err, results) => {
    if(err) {
      res.send(errorMessage(err));
      return;
    }
    else if(results.affectedRows === 0) {
      res.send("Incorrect Password, cannot delete user!")
    }
    else {
    res.redirect('/users');
    }
  }) //either flat array or 2d array wrapped in another array
})



let errorMessage = (err) => {
  return (`Your error is ${err.message}`);
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});