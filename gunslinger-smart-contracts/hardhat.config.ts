import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ANKR_NODE_API_KEY = vars.get("ANKR_NODE_API_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://rpc.ankr.com/bsc/${ANKR_NODE_API_KEY}`,
      },
    },
    "bsc-testnet": {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [], // TODO: add account
    },
  },
};

export default config;
