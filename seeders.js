const bcrypt = require('bcrypt')
const {register} = require('./dbService')

exports.seedUsers = () => {
    let user1 = {}, user2 = {};
    user1.username = 'Nikola';
    user1.password = 'Test.123';
  
    user2.username = 'Lazar';
    user2.password = 'Test.123';
  
    user1.passwordHash = bcrypt.hashSync(user1.password, 10);
    register(user1);
    user2.passwordHash = bcrypt.hash(user2.password, 10);
    register(user2);
}