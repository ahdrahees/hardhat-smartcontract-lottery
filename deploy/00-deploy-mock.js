const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChains.includes(network.name)) {
        log("Local network is detected! Deploying mocks....")

        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: [],
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        log("Mocks deployed!")
        log("------------------Mocks---deployed------------------")
    }
}
