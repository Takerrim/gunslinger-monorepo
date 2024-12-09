// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDMock is ERC20 {
  constructor() ERC20("USDMock", "USDM") {}

  function mint(address account, uint256 amount) external {
    _mint(account, amount);
  }
}
