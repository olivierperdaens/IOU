let User = require('../model/user');
let expect = require('chai').expect;
let assert = require('chai').assert;
let friendPredictor = require('../model/friendPredictor');



describe("User", ()=>{
  let baseUser = new User("")
  let user1 = new User("1");
  let user2 = new User("2");
  let user3 = new User("3");
  let user4 = new User("4");
  let user5 = new User("5");
  let user6 = new User("6");
  let user7 = new User("7");
  let user8 = new User("8");
  let user9 = new User("9");
  let user10 = new User("10");
  let user11 = new User("11");
  let user12 = new User("12");






  it('shloud be able to add a friend to an existing user', ()=>{
    user1.addFriend(user2);
    let check = user1.isFriendWith(user2);
    assert.equal(check, true);
  });

  it("when adding a friend both should become friends", ()=>{
    user1.addFriend(user2);
      expect(user2.isFriendWith(user1)).be.true;
  })
});
