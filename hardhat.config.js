require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL
const GANACHE_RPC_URL = process.env.GANACHE_RPC_URL

const PRIVATE_KEY = process.env.PRIVATE_KEY
const GANACHE_PRIVATE_KEY = process.env.GANACHE_PRIVATE_KEY

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.18",
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player_1: {
            default: 1,
        },
        player_2: {
            default: 2,
        },
    },
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
        },
        sepoli: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            // accounts hardhat automaticaly place
            chainId: 31337,
        },
        polygon: {
            url: POLYGON_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 137,
            blockConfirmations: 6,
        },
        ganache: {
            url: GANACHE_RPC_URL,
            accounts: [GANACHE_PRIVATE_KEY],
            chainId: 5777,
            blockConfirmations: 6,
        },
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas-reporter.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "ETH",
    },
}
