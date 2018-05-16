class Debt {

  constructor(amount){
    this.amount = amount;
    this.cleared = amount === 0;
  }

  addDebiteur(user){
    if(typeof this.crediteur === "undefined" || this.crediteur == null){
      this.debiteur = user
    }
    else{
      if(this.crediteur.isFriendWith(user)){
        this.debiteur = user
      }
      else{
        throw new Error("Users must be friends to share a debt")
      }
    }
  }

  addCrediteur(user){
    if(typeof this.debiteur === "undefined" || this.debiteur == null){
      this.crediteur = user
    }
    else{
      if(this.debiteur.isFriendWith(user)){
        this.crediteur = user
      }
      else{
        throw new Error("Users must be friends to share a debt")
      }
    }
  }

  addDebt(amount){
    this.amount += amount;
  }

  rembourseDebt(amount){
    if(this.amount - amount >= 0){
      this.amount -= amount
      if(this.amount === 0){
          this.cleared = true
      }
    }
    else{
      let old_debiteur = this.debiteur
      let old_crediteur = this.crediteur
      this.debiteur = old_crediteur
      this.crediteur = old_debiteur
      this.cleared = false
      this.amount = Math.abs(this.amount -= amount)
    }
  }


}

module.exports = Debt;
