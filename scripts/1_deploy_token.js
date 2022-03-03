//commands 
//npx hardhat run --network rinkeby scripts/1_deploy_token.js
async function main() {
    // We get the contract to deploy
    const Mytoken = await ethers.getContractFactory("MyToken");
    console.log("Deploying MyToken");
    const myToken = await Mytoken.deploy();
    console.log("MyToken deployed to:", myToken.address);
  
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });