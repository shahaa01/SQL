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

  console.log(getRandomUser());