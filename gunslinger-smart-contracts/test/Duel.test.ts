import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import hre from 'hardhat';
import { Game, USDMock } from '../typechain-types';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { DuelStatus, EMPTY_ADDRESS } from '../constants/contract.constants';

const BET_SIZE = 6;

async function gameFixture() {
  const game = await hre.ethers.deployContract('Game');

  const [firstAccount, secondAccount] = await hre.ethers.getSigners();
  const usdMock = await hre.ethers.deployContract('USDMock');

  await (await usdMock.mint(firstAccount.address, 1000)).wait();
  await (await usdMock.mint(secondAccount.address, 1000)).wait();

  return {
    usdMock,
    player1: firstAccount,
    player2: secondAccount,
    game,
  };
}

const depositBetToGame = async ({
  betSize,
  players,
  usdMock,
  game,
}: {
  betSize: number;
  players: HardhatEthersSigner[];
  usdMock: USDMock;
  game: Game;
}) => {
  const gameAddress = await game.getAddress();

  for (const player of players) {
    await usdMock
      .connect(player)
      .approve(gameAddress, hre.ethers.parseUnits('1000', 18));

    await game
      .connect(player)
      .deposit(player.address, betSize, await usdMock.getAddress());
  }
};

describe('Duel', () => {
  it('[deposit] works correctly', async () => {
    const { game, usdMock, player1, player2 } = await loadFixture(gameFixture);

    await depositBetToGame({
      betSize: BET_SIZE,
      players: [player1, player2],
      usdMock: usdMock,
      game,
    });
    const gameAddress = await game.getAddress();

    expect(await usdMock.balanceOf(gameAddress)).to.be.equal(BET_SIZE * 2);
  });

  it('[createAndStartDuel] works correctly', async () => {
    const { game, player1, player2 } = await loadFixture(gameFixture);

    const tx = await game.createAndStartDuel(
      [player1.address, player2.address],
      BET_SIZE
    );

    await tx.wait();

    const duels = await game.getDuels(player1.address);
    expect(duels.at(0)?.status).to.be.equal(DuelStatus.Started);
  });

  it('[cancelDuel] works correctly', async () => {
    const { game, usdMock, player1, player2 } = await loadFixture(gameFixture);

    await depositBetToGame({
      betSize: BET_SIZE,
      players: [player1, player2],
      usdMock: usdMock,
      game,
    });

    const createAndStartDuelTx = await game.createAndStartDuel(
      [player1.address, player2.address],
      BET_SIZE
    );

    await createAndStartDuelTx.wait();

    const tx = await game.cancelDuel(
      [player1.address, player2.address],
      await usdMock.getAddress()
    );

    await tx.wait();

    const duelsOfPlayer1 = await game.getDuels(player1.address);
    const duelsOfPlayer2 = await game.getDuels(player2.address);

    expect(duelsOfPlayer1.at(0)?.status).to.be.equal(DuelStatus.Canceled);
    expect(duelsOfPlayer2.at(0)?.status).to.be.equal(DuelStatus.Canceled);
    expect(await usdMock.balanceOf(await game.getAddress())).to.be.equal(0);
  });

  it('[finishDuel] works correctly', async () => {
    const { game, player1, player2, usdMock } = await loadFixture(gameFixture);

    await depositBetToGame({
      betSize: BET_SIZE,
      players: [player1, player2],
      usdMock: usdMock,
      game,
    });

    const createAndStartDuelTx = await game.createAndStartDuel(
      [player1.address, player2.address],
      BET_SIZE
    );

    await createAndStartDuelTx.wait();

    const playerBalanceBeforeWin = await usdMock.balanceOf(player1.address);

    const tx = await game.finishDuel(
      player1.address,
      player2.address,
      await usdMock.getAddress()
    );

    await tx.wait();

    const duelsOfPlayer1 = await game.getDuels(player1.address);
    const duelsOfPlayer2 = await game.getDuels(player2.address);

    expect(duelsOfPlayer1.at(0)?.status).to.be.equal(DuelStatus.Finished);
    expect(duelsOfPlayer2.at(0)?.status).to.be.equal(DuelStatus.Finished);

    expect(duelsOfPlayer1.at(0)?.winner).to.be.equal(player1.address);
    expect(duelsOfPlayer2.at(0)?.winner).to.be.equal(EMPTY_ADDRESS);

    const duel = duelsOfPlayer1.at(0);

    if (duel) {
      const balanceOfWinner = await usdMock.balanceOf(player1.address);
      const stake = playerBalanceBeforeWin + duel.betAmount * 2n;
      expect(balanceOfWinner).to.be.equal(stake);
    }
  });
});
