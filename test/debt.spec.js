let assert = require('assert');

let Debt = require('../model/Debt');
let User = require('../model/User');


describe('Debt', () => {
  let user1;
  let user2;
  let debt;

  beforeEach(()=>{
    user1 = new User("jean");
    user2 = new User("marc");
    user1.addFriend(user2);
    debt = new Debt(100);
  });

  it('should be able to create a debt and link users', () => {
    debt.addDebiteur(user1);
    debt.addCrediteur(user2);
    assert.equal(debt.debiteur, user1);
    assert.equal(debt.crediteur, user2);
    assert.equal(debt.amount, 100);
  });

  describe("when a part of the debt is partially refunded", () => {
    beforeEach(()=>{
      debt.addDebiteur(user1);
      debt.addCrediteur(user2);
    });

    it('amount should be increased', () => {
      debt.addDebt(20);
      assert.equal(debt.amount, 120);
    });

    it('amount should be decreased', () => {
      debt.rembourseDebt(20);
      assert.equal(debt.amount, 80);
    });

    it("debt should be inversed", ()=>{
      debt.rembourseDebt(150);
      assert.equal(debt.debiteur, user2);
      assert.equal(debt.crediteur, user1);
      assert.equal(debt.amount, 50);
    });
  });

  describe("when debt is totaly refunded", ()=>{
    it("debt should be resumed", ()=>{
      debt.rembourseDebt(100);
      assert.equal(debt.amount, 0);
      assert.equal(debt.cleared, true);
    })
  });

});
