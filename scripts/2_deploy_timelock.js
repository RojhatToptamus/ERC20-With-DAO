// deployer for timelock
//const argumentsArray = require('../arguments.js');

async function main() { 

    var delayTime = 150;
    var proposersArray = ['0x20D60aA2F7416057069352AC1E694772c407FD05'];
    var executorsArray = ['0x20D60aA2F7416057069352AC1E694772c407FD05'];

    const [deployer] = await ethers.getSigners();
  
    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
    
    console.log("Account balance:", (await deployer.getBalance()).toString()); 
  
    const Token = await ethers.getContractFactory('contracts/TimelockController.sol:TimelockController');

    const token = await Token.deploy(delayTime, proposersArray, executorsArray);

    console.log("Timelock address:", token.address);

  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });