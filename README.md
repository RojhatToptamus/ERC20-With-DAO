# Basic ERC20 Token Contract with a Governor Contract(Without a Timelock Controller Contract)
This project has a basic ERC20 Contract which can be governed by the Governor Contract and it does not have a timelock controller. Please check RojhatToptamus/ERC20-With-DAO-Timelock repository for the version with a Timelock Controller.

Used Technologies
Solidity, Hardat, Ether.js, Openzeppelin 

Note: These codes may have some vulnerabilities so please use them on your own responsibility and do not deploy them to the main network!


Try running the following tasks or execute "npx hardhat test" command to run hardhat test file(test/governor-test.js)
```shell
npx hardhat run --network rinkeby scripts/1_deploy_token.js
npx hardhat run --network rinkeby scripts/3_deploy_governor.js
npx hardhat console --network rinkeby
const MyGovernor = await hre.ethers.getContractFactory('MyGovernor');
const myGovernor = MyGovernor.attach([Deployed Governor Contract Address]);
const MyToken = await hre.ethers.getContractFactory('MyToken');
const myToken = MyToken.attach([Deployed Token Contract Addreess]);

let accounts = await ethers.getSigner():

Task 1: Mint Some Tokens for voting power and delegate voting power

await myToken.mintToken(accounts[0].address, ethers.utils.parseUnits('1.0', 'ether'));
await myGovernor.delegates(accounts[0].address); // returns delegated accounts
await myGovernor.delegate(accounts[0].address) // delegate to yourself
await myToken.transferOwnership([Governor Contract Address]); // transfer token contract ownership to the governor

Task 2: Create a proposal

const receiverAddress = '0x2F9f3505CbXXXXX'; // Type one of your accounts, minted tokens will be sent by governor contract
const transferCalldata = myToken.interface.encodeFunctionData('mintToken', [receiverAddress,12]); // mint 12 wei to receiver address
let result = await myGovernor.propose(['token contract address'],[0], [transferCalldata], 'Mint 12 wei to  receiver address',);
let receiptValue = await result.wait();
console.log(receiptValue.events.filter((x) => {return x.event == "ProposalCreated"})); // print ProposalCreated event on console this will return the proposal id
const pID = ethers.BigNumber.from([type the proposal id]);
await myGovernor.state(pID); // get proposal state 0:pending 1:Active 2: Cancelled 3:Defeated 4:Succeeded

Task 3: Cast Vote

myGovernor.castVote(pID, '1'); // 0: abstain 1: Support 2: Against

Task 4: Execute Proposal

const descriptionHash = ethers.utils.id('Mint 12 wei to  receiver address');
await myGovernor.execute(pID,[token contract address],[0],[transferCalldata],descriptionHash);




```
