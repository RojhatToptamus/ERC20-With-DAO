// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "hardhat/console.sol";

contract MyToken is ERC20, ERC20Permit, ERC20Votes {

    bool private isGovernorSet = false;
    address private contractOwner;
  

    constructor() ERC20("MyToken", "AAA") ERC20Permit("MyToken") {
        contractOwner = msg.sender;
    }

    modifier onlyGovernor() {
        require(msg.sender == contractOwner, "Only Governor!");
        _;
    }

    // to transfer ownership to the Governor Contract
    function transferOwnership(address newOwner) external {
        require(msg.sender == contractOwner, "only contractOwner");
        require(!isGovernorSet, "Owner can only be set once!");
        require(newOwner != address(0), "Unvalid address");
        contractOwner = newOwner;
        isGovernorSet = true;
    }

    // delegate your voting power
    function delegate(address delegatee) public virtual override {
        require(delegatee == msg.sender, "Does not have access");
        _delegate(_msgSender(), delegatee);
        console.log("Your voting power is delegated to : ", delegatee);
    }

    // get delegated account
    function delegates(address account)
        public
        view
        virtual
        override
        returns (address)
    {
        console.log("Delegated account is : ", _delegates[account]);
        return _delegates[account];
    }

    function mintToken(address to, uint256 amount) public onlyGovernor {
        _mint(to, amount);
        console.log("Token minted new balance: ", balanceOf(to));
    }

    function burnToken(address account, uint256 amount) public onlyGovernor {
        _burn(account, amount);
        console.log("Token burned new balance: ", balanceOf(account));
    }

    // The functions below are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}
