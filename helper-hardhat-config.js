const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: "goerli",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 150 gwei Key Hash
        subscriptionId: "0",
        callBackGasLimit: "500000", // 500,000
        interval: "30",
    },
    1115511: {
        name: "sepolia",
        vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei Key Hash
        subscriptionId: "0",
        callBackGasLimit: "500000",
        interval: "30", //seconds
    },
    137: {
        name: "polygon",
        vrfCoordinatorV2: "0xAE975071Be8F8eE67addBC1A82488F1C24858067",
        entranceFee: ethers.utils.parseEther("2"),
        gasLane: "0x6e099d640cde6de9d40ac749b4b594126b0169747122711109c9985d47751f93", // 200 gwei Key Hash
        // subscriptionId:
        callBackGasLimit: "500000",
        interval: "1800", // 30 minutes
    },
    31337: {
        name: "hardhat",
        entranceFee: ethers.utils.parseEther("1"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        // for mocks doesn't care what gasLane we're working on, because we are mocking gaslane anyway, so we can here use any of above gasLane for other chains.

        callBackGasLimit: "500000",
        interval: "30",
    },
    5777: {
        name: "ganache",
        entranceFee: ethers.utils.parseEther("1"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        // for mocks doesn't care what gasLane we're working on, because we are mocking gaslane anyway, so we can here use any of above gasLane for other chains.

        callBackGasLimit: "500000",
        interval: "30",
    },
}

const developmentChains = ["hardhat", "localhost", "ganache"]

module.exports = { networkConfig, developmentChains }
