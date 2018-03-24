Feature: Pay a debt

  Scenario: User 2 pay a part of his debt to User 1
    Given: User 2 owe money to User 1

    When: User 2 has partially refunded User 1
    And: User 1 confirm receiving this money
    Then: the debt is decreased


  Scenario: User 2 pay entirely his debt to User 1
    Given: User 2 owe money to User 1

    When: User 2 has totally refunded User 1
    And: User 1 confirm receiving this money
    Then: the debt is deleted from both account
