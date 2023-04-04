const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config.js")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Test", function () {
          let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval
          const chainId = network.config.chainId

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer // it is similar to this, const { deployer } = await getNamedAccounts() , but there is a difference here deployer declared in globaly as a variable (not as const)
              await deployments.fixture(["all"]) // this line run the entire deploy folder files ( ["all"] tags containing file). so this will basically deploy our mock and contract so we can us in our test

              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)

              raffleEntranceFee = await raffle.getEntranceFee()
              interval = await raffle.getInterval()
          })

          describe("constructor", function () {
              it("initializes the raffle correctly", async function () {
                  // Ideally we make our test has just 1 assert per "it"
                  const raffleState = await raffle.getRaffleState()

                  assert.equal(raffleState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"])
              })
          })

          describe("enterRaffle", function () {
              it("reverts when you don't pay enough", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      "Raffle__NotEnoughtETHEntered"
                  )
              })

              it("records players when they enter", async function () {
                  // entrance fee
                  // fund { value}
                  // get the player addresss and match it with deployer
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playerFromContract = await raffle.getPlayer(0)

                  assert.equal(playerFromContract, deployer)
              })

              it("emits an event on enter", async function () {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(
                      raffle,
                      "RaffleEnter"
                  )
              })

              it("doesn't allow entrance when raffle is calculating", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee }) // here raffle state is now open

                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]) // this will increase the blockTime into 31 sec . so the interval is finished and we can select new winner
                  await network.provider.send("evm_mine", []) // await network.provider.request({ method: "evm_mine", params: [] }) // mine new blocks
                  // we pretendt to be chainlinl keeper
                  await raffle.performUpkeep([]) // raffle state is calculating now by calling the performUpkeep()
                  // now we can test Raffle__NotOpen() error in contract
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith(
                      "Raffle__NotOpen"
                  )
              })
          })

          describe("checkUpkeep", function () {
              it("returns false if people haven't send any ETH", async function () {
                  // we didn't send any ETH or no players
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])

                  assert(!upkeepNeeded) // assert.equal(upkeepNeeded, false)
              })

              it("returns false if raffle isn't open", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })

                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])

                  await raffle.performUpkeep("0x") // "0x" similar to [] in here . it is another way to send blank bytes object

                  const raffleState = await raffle.getRaffleState()
                  assert.equal(raffleState.toString(), "1")

                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert.equal(upkeepNeeded, false)
              })

              it("returns false if enough time hasn't passed", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() - 5])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // "0x" similar to [] in here
                  assert(!upkeepNeeded)
              })

              it("returns true if enough time has passed, has players, balance and is open", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // "0x" similar to [] in here
                  assert(upkeepNeeded)
              })
          })
      })
