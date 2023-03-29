const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseUnits("0.25", 18) // 0.25 LINK is the premium, It costs 0.25 LINK per request
const GAS_PRICE_LINK = 1e9 //1000000000, link per gas, Calculated value based on the gas price of the chain

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("\nLocal network is detected! Deploying mocks....")
        // Deploying VRFCoordinator mock
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
            // waitConfirmations: network.config.blockConfirmations || 1,
        })
        log("Mocks deployed!")
        log("------------------Mocks---deployed------------------\n")
    }
}

module.exports.tags = ["all", "mocks"]
