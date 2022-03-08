const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const assert = require("assert");


const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");

let myToken;
let myGovernor;
let accounts;
let pID;
let transferCalldata;
let TokenAddress;
let GovernorAddress;

describe("Deployer", function () {
  before('deploy contracts', async function(){

    accounts = await ethers.getSigners();
  
    console.log(
      "Deploying contracts with the account:",
      accounts[0].address
    );

    console.log("Account balance:", (await accounts[0].getBalance()).toString()); 


    // Deploy Token Contract
    const MyToken = await hre.ethers.getContractFactory('MyToken')
    myToken = await MyToken.deploy()
    TokenAddress = myToken.address
    await myToken.deployed()
    console.log("Token Contract deployed at: "+TokenAddress)

    // Deploy Governor Contract
    const MyGovernor = await hre.ethers.getContractFactory('MyGovernor')
    myGovernor = await MyGovernor.deploy(TokenAddress,ZERO_ADDRESS) // assign zero address to create a dao without timelock contract
    await myGovernor.deployed()
    GovernorAddress = myGovernor.address
    console.log("Governor Contract deployed at: "+GovernorAddress)

  });


  it('gets deployed governor contract name', async function (){
    const deployedVersion = await myGovernor.name();
    console.log(deployedVersion);
  });

  it('mints governance token to deployer address', async function (){
    const beforeBalance = await myToken.balanceOf(accounts[0].address)
    await myToken.mintToken(accounts[0].address, ethers.utils.parseUnits('10.0', 'ether'));
    await myToken.delegate(accounts[0].address);
    await myToken.delegates(accounts[0].address);
    const afterBalance = await myToken.balanceOf(accounts[0].address)

    console.log("Before minting: "+ beforeBalance +" After minting:" + afterBalance)
  });


  it('creates proposal', async function (){
    const receiverAddress = accounts[1].address; 
    transferCalldata = myToken.interface.encodeFunctionData('mintToken', [receiverAddress,ethers.utils.parseUnits('7.0', 'ether')]);
    const tx = await myGovernor.propose([myToken.address],[0], [transferCalldata], 'Mint 7 gwei',);
    const receiptValue = await tx.wait();
    pID = ethers.BigNumber.from(receiptValue.events[0].args[0]);
    const description = receiptValue.events[0].args[8];
    const fullHash = (receiptValue.events.filter((x) => {return x.event == "ProposalCreated"}));
    console.log("Proposal ID: "+pID)
    console.log("Descriptopn"+description)
  });
  
  it('casts vote', async function (){

    await hre.network.provider.send("evm_mine"); // mine 1 block
    const tx = await myGovernor.castVote(pID, '1');
    const receiptValue = await tx.wait();
    const voteAccount = receiptValue.events[0].args[0];
    const votedProposal = receiptValue.events[0].args[1];
    console.log("Account: "+voteAccount)
    console.log("Proposal: "+votedProposal)
    expect(await myGovernor.hasVoted(pID, accounts[0].address)).to.equal(true);

  });

  it('execute proposal', async function (){
    // delay time needed for proposal to be active
    await hre.network.provider.send("evm_mine");
    await hre.network.provider.send("evm_mine");
    expect(await myToken.balanceOf(accounts[1].address)).to.equal(ethers.utils.parseUnits('0.0', 'ether'));
    const descriptionHash = ethers.utils.id('Mint 7 gwei');
    await myGovernor.execute([TokenAddress],[0],[transferCalldata],descriptionHash,);
    await hre.network.provider.send("evm_mine");
    expect(await myToken.balanceOf(accounts[1].address)).to.equal(ethers.utils.parseUnits('7.0', 'ether'));
  });

  
});
