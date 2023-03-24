// raffle

// enter the lottery (amount to pay )
// pick random winner( verifyably random)
// winner to be selected in X minutes -> complelty automated
// chainlink oracle -> Randomness, Automated Execution (Chain link keeper)

// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

error Raffle__NotEnoughtETHEntered();
error Raffle__FailedToTransferETH();

contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    /* State Variable */
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCOORDINATOR;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3; // Cap letter and _ is best style practive for constant variables
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    // Lottery Variables
    address private s_recentWinner;

    // Events
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCOORDINATOR = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function enterRaffle() public payable {
        // require(msg.value > i_entranceFee, "Not enough ETH");
        // error codes are gas efficeint than using require
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughtETHEntered();
        } else {
            s_players.push(payable(msg.sender));
            emit RaffleEnter(msg.sender);
        }
        // name events with the function name reversed
    }

    /**
     * @dev This is the function that the chainlink keeper/Automation nodes call
     * They look for the `upkeepNeeded` to return true.
     * The following should be true in order to return true:
     * 1. Our time intervel should have passed.
     * 2. The lottery should have atleast 1 player, and have some ETH.
     * 3. Our subscription funded with LINK.
     * 4. The lottery should be in "Open" state.
     */

    function checkUpkeep(
        bytes calldata /* checkData */
    ) external override returns (bool upkeepNeeded, bytes memory /* performData */) {}

    function performUpkeep(bytes calldata performData) external override {}

    function requestRandomWinner() external {
        // request a random number
        //nce we get it do something with it
        // 2 transaction process

        uint256 requestId = i_vrfCOORDINATOR.requestRandomWords(
            i_gasLane, // keyHash
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__FailedToTransferETH();
        }
        emit WinnerPicked(recentWinner);
    }

    /* view / pure functions */
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }
}
