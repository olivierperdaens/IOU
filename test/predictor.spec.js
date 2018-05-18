let User = require('../model/user');
//let expect = require('chai').expect;
//let assert = require('chai').assert;
let friendPredictor = require('../model/friendPredictor');



describe("User", ()=>{
  /*
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
  */

  console.log("**************************test***********************");

 User.getFriendsListPredictor("5afec7ce6ebeb22ac8701394",function(res){

 } );




  it('shloud be able to add a friend to an existing user', ()=>{


    assert.equal(exists, true);
  });

  it("when adding a friend both should become friends", ()=>{

      //expect(user2.isFriendWith(user1)).be.true;
  })
});
