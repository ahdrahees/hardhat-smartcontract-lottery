// raffle

// enter the lottery (amount to pay )
// pick random winner( verifyably random)
// winner to be selected in X minutes -> complelty automated
// chainlink oracle -> Randomness, Automated Execution (Chain link keeper)

// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

error Raffle__NotEnoughtETHEntered();

contract Raffle {
    /* State Variable */
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        // require(msg.value > i_entranceFee, "Not enough ETH");
        // error codes are gas efficeint than using require
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughtETHEntered();
        } else {
            s_players.push(payable(msg.sender));
        }
    }

    // function pickRandomWinner() returns () {}

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
