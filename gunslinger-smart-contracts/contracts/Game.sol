// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

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
    event WithdrawalSucceed();

    address private constant USDT_BEP20_ADDRESS = 0x55d398326f99059fF775485246999027B3197955;

    // In percents
    uint256 private constant BASE_FEE = 2;

    mapping (address => Duel[]) public userToDuels;

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

    function computeBetForPlayer(uint256 _betAmount) pure private returns (uint256) {
        (bool success, uint256 result) = _betAmount.tryDiv(2);
        require(success);
        return result;
    }

    function getActiveDuel(address _player) view private returns (Duel storage) {
        Duel storage duel = userToDuels[_player][userToDuels[_player].length - 1];

        require(duel.status == DuelStatus.Started, "Duel is not active");

        return duel;
    }

    function cancelDuel(address [] memory _players) public {
        Duel storage duelOfFirstPlayer = getActiveDuel(_players[0]);
        Duel storage duelOfSecondPlayer = getActiveDuel(_players[1]);

        require(duelOfFirstPlayer.status == DuelStatus.Started, "DuelOfFirstPlayer is not in started status");
        require(duelOfSecondPlayer.status == DuelStatus.Started, "DuelOfSecondPlayer is not in started status");

        duelOfFirstPlayer.status = DuelStatus.Canceled;
        duelOfSecondPlayer.status = DuelStatus.Canceled;

        withdraw(_players[0], computeBetForPlayer(duelOfFirstPlayer.betAmount + percentsToAbs(duelOfFirstPlayer.betAmount, BASE_FEE)));
        withdraw(_players[1], computeBetForPlayer(duelOfSecondPlayer.betAmount + percentsToAbs(duelOfSecondPlayer.betAmount, BASE_FEE)));
    }

    function finishDuel(address _winner, address _loser) payable public {
        Duel storage duelOfWinner = getActiveDuel(_winner);
        Duel storage duelOfLoser = getActiveDuel(_loser);

        duelOfWinner.finishedAt = block.timestamp;
        duelOfWinner.status = DuelStatus.Finished;

        duelOfLoser.finishedAt = block.timestamp;
        duelOfLoser.status = DuelStatus.Finished;

        withdraw(_winner, duelOfWinner.betAmount);
    }

    function deposit(address _player, uint256 _betAmount) public  {
        IERC20 usdtContract = IERC20(USDT_BEP20_ADDRESS);
        uint256 allowance = usdtContract.allowance(_player, address(this));

        uint256 betAmountWithFee = _betAmount + percentsToAbs(_betAmount, BASE_FEE);

        if (allowance < _betAmount) {
            bool successApprove = usdtContract.approve(address(this), betAmountWithFee);
            require(successApprove, 'Approve failed');
        }

        bool successTransfer = usdtContract.transferFrom(_player, address(this), betAmountWithFee);
        require(successTransfer, 'Transfer failed');
        emit DepositSucceed();
    }

    function withdraw(address _player, uint256 _betAmount) private  {
        IERC20 usdtContract = IERC20(USDT_BEP20_ADDRESS);
        bool success = usdtContract.transferFrom(address(this), _player, _betAmount);
        require(success, 'Withdrawal failed');
        emit WithdrawalSucceed();
    }

    function percentsToAbs(uint256 _value, uint256 _percent) private pure returns (uint256) {
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
