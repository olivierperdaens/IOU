let User = require('../model/User');
let expect = require('expect');
let assert = require('assert');


describe("User", ()=>{
  let user1 = new User("Jean");
  let user2 = new User("Marc");

  it('shloud be able to add a friend to an existing user', ()=>{
    user1.addFriend(user2);
    let check = user1.isFriendWith(user2);
    assert.equal(check, true);
  });

  it("when adding a friend both should become friends", ()=>{
    user1.addFriend(user2);
    let check = user2.isFriendWith(user1);
    assert.equal(check, true);
  })
});
