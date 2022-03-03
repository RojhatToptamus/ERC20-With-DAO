//npx hardhat run --network rinkeby scripts/deploy.js
async function main() {

    // We get the contract to deploy
    const MyGovernor = await ethers.getContractFactory("MyGovernor");
    console.log("Deploying MyGovernor");
    // OZ Governor without timelock
    const myGovernor = await MyGovernor.deploy([deployed token contract address],"0x0000000000000000000000000000000000000000");
    const deployedGovernor  = await myGovernor.deployed()
    console.log("MyGovernor deployed to:", myGovernor.address);
  
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
