[{
  id: '/#12poiajdspfoif',
  name: 'Andrew',
  room: 'The Office Fans'
}]

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
    // Adding into users array.
    var user = {
      id,
      name,
      room
    };
    this.users.push(user);
    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0]
  }
  
  removeUser(id) {
    var user = this.getUser(id);

    if (user) {
      // wo le rahe hai jo nahi hai present us id se 0.
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }

  getUserList(room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

module.exports = {
  Users
};