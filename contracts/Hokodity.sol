// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Hokodity {
  address payable private owner;

  constructor() {
    owner = payable(msg.sender);
  }
  
  receive() external payable {}

  function withdraw(uint _amount) external {
    require(payable(msg.sender) == owner, "only the the owner can withdraw");
    owner.transfer(_amount);
  }

  function getBalance() external view returns (uint) {
    return address(this).balance;
  }
}
