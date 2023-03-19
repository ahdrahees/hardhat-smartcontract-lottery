// raffle

// enter the lottery (amount to pay )
// pick random winner( verifyably random)
// winner to be selected in X minutes -> complelty automated
// chainlink oracle -> Randomness, Automated Execution (Chain link keeper)

// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

error Raffle__NotEnoughtETHEntered();

contract Raffle is VRFConsumerBaseV2 {
    /* State Variable */
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    // Events
    event RaffleEnter(address indexed player);

    constructor(address vrfCoordinatorV2, uint256 entranceFee) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
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

    function requestRandomWinner() external {
        // request a random number
        //nce we get it do something with it
        // 2 transaction process
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {}

    /* view / pure functions */
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
