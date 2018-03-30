class User {

  constructor(name) {
    this.name = name
    this.friends = []
  }

  addFriend(user){
    this.friends.push(user)
    if(!user.isFriendWith(this)){
      user.addFriend(this)
    }
  }

  isFriendWith(user){
    return this.friends.includes(user)
  }

}

module.exports = User;
