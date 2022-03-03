const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  before('get factories', async function(){
    const MyGovernor = await hre.ethers.getContractFactory('MyGovernor');
    const myGovernor = MyGovernor.attach('0xA1028E7CACFe463A9D4C098E55786bc360b928Ee');
    const MyToken = await hre.ethers.getContractFactory('MyToken');
    const myToken = MyToken.attach('0x1EA809a6Bd94487C02b5fE2a977f474Fb9a7f40E');
    const myAddress = "0x96dbD26722efeBc80454C5b050f6Df1d5a3D41D2";
  });


  it('deploys deposit', async function (){
    assert(await depositorInstance.version() === 'v2!');
    const deployedVersion = await depositorInstance.version();
    console.log(deployedVersion);
  });
});
