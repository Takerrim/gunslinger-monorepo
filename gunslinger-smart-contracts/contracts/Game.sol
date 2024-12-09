// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

struct Duel {
    address[] players;
    address winner;
    uint256 betAmount;
    uint256 createdAt;
    uint256 finishedAt;
    DuelStatus status;
}

enum DuelStatus {
    Started,
    Finished,
    Canceled
}

contract Game {
    using Math for uint256;

    event DepositSucceed();
    event WithdrawalSucceed(address indexed player, uint256 amount, address token);

    // In percents
    uint256 private constant BASE_FEE = 2;

    mapping (address => Duel[]) public userToDuels;

    function getDuels(address _user) public view returns (Duel[] memory) {
        return userToDuels[_user];
    }

    function createAndStartDuel(address[] memory _players, uint256 _betAmount) public {
        Duel memory duel = Duel(
            _players,
            address(0),
            _betAmount,
            block.timestamp,
            0,
            DuelStatus.Started
        );

        userToDuels[_players[0]].push(duel);
        userToDuels[_players[1]].push(duel);
    }

    function _getActiveDuel(address _player) view private returns (Duel storage) {
        require(userToDuels[_player].length > 0, "No duels found for this player");

        uint256 lastIndex;
        unchecked {
            lastIndex = userToDuels[_player].length - 1;
        }

        Duel storage duel = userToDuels[_player][lastIndex];

        require(duel.status == DuelStatus.Started, "Duel is not active");

        return duel;
    }

    function cancelDuel(address [] memory _players, address _BEP20Token) public {
        Duel storage duelOfFirstPlayer = _getActiveDuel(_players[0]);
        Duel storage duelOfSecondPlayer = _getActiveDuel(_players[1]);

        require(duelOfFirstPlayer.status == DuelStatus.Started, "DuelOfFirstPlayer is not in started status");
        require(duelOfSecondPlayer.status == DuelStatus.Started, "DuelOfSecondPlayer is not in started status");

        duelOfFirstPlayer.status = DuelStatus.Canceled;
        duelOfSecondPlayer.status = DuelStatus.Canceled;

        // Bet amount is always equal for each player, can get bet amount from first player 
        uint256 betAmount = duelOfFirstPlayer.betAmount + _percentsToAbs(duelOfFirstPlayer.betAmount, BASE_FEE);

        _withdraw(
            _players[0],
            betAmount,
            _BEP20Token
        );
        _withdraw(
            _players[1],
            betAmount,
            _BEP20Token
        );
    }

    function finishDuel(address _winner, address _loser, address _BEP20Token) payable public {
        Duel storage duelOfWinner = _getActiveDuel(_winner);
        Duel storage duelOfLoser = _getActiveDuel(_loser);

        duelOfWinner.finishedAt = block.timestamp;
        duelOfWinner.status = DuelStatus.Finished;
        duelOfWinner.winner = _winner;

        duelOfLoser.finishedAt = block.timestamp;
        duelOfLoser.status = DuelStatus.Finished;

        (bool successMul, uint256 stake) = duelOfWinner.betAmount.tryMul(2);
        require(successMul);

        _withdraw(_winner, stake, _BEP20Token);
    }

    function deposit(address _player, uint256 _betAmount, address _BEP20Token) public  {
        IERC20 bep20Contract = IERC20(_BEP20Token);
        uint256 allowance = bep20Contract.allowance(_player, address(this));

        uint256 betAmountWithFee = _betAmount + _percentsToAbs(_betAmount, BASE_FEE);

        require(allowance >= betAmountWithFee, "Insufficient allowance");
        require(bep20Contract.balanceOf(_player) >= betAmountWithFee, "Insufficient balance");

        bool successTransfer = bep20Contract.transferFrom(_player, address(this), betAmountWithFee);
        require(successTransfer, 'Transfer failed');
        emit DepositSucceed();
    }

    function _withdraw(address _player, uint256 _betAmount, address _BEP20Token) private  {
        IERC20 bep20Contract = IERC20(_BEP20Token);

        uint256 contractBalance = bep20Contract.balanceOf(address(this));
        require(contractBalance >= _betAmount, "Insufficient contract balance");

        bool success = bep20Contract.transfer(_player, _betAmount);
        require(success, 'Withdrawal failed');

        emit WithdrawalSucceed(_player, _betAmount, _BEP20Token);
    }

    function _percentsToAbs(uint256 _value, uint256 _percent) private pure returns (uint256) {
        (bool success, uint256 result) = _value.tryMul(_percent);
        require(success);
        return result / 100;
    }

    receive() external payable {
        // this built-in function doesn't require any calldata,
        // it will get called if the data field is empty and 
        // the value field is not empty.
        // this allows the smart contract to receive ether just like a 
        // regular user account controlled by a private key would.
    }
}
