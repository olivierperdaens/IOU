Feature: Add new debt

  Scenario: Creating a debt
    Given: both user are already "friends" and registered on the app

    When: User 1 creates a debt to User 2
    Then: User 2 received a message where he has to accept this debt or not

  Scenario: Debt accepted by the other user
    Given: User 1 has create a new debt to User 2

    When: User 2 accept the debt
    Then: the debt is registered for both users


  Scenario: Debt refused by the other user
    Given: User 1 has create a new debt to User 2

    When: User 2 refuse the debt
    Then: The debt is not registered for User 2 and User 1 received a message saying that the debt was rejected
    Then: The debt is delete from User 1's list


