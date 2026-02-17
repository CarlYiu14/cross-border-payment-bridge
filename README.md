# Decentralized Cross-Border Payment Bridge



## Overview

This repository contains the core infrastructure for a **Decentralized Cross-Border Payment Bridge**. The system is designed to facilitate secure, low-latency asset transfers between Ethereum-compatible networks (EVM).



This project consists of two main components:

1.  **Smart Contracts (Solidity):** Handles the locking (custody) of assets on the source chain and the release of assets on the destination chain.

2.  **Relayer Service (Go):** An off-chain backend service that monitors blockchain events and orchestrates the settlement on the destination network.



## Architecture

The bridge utilizes a **Lock-and-Release** mechanism:

* **Source Chain:** User calls `deposit()`. Assets are locked in the contract.

* **Off-Chain:** The Go Relayer detects the `Deposit` event via WebSocket subscription.

* **Destination Chain:** After block confirmations, the Relayer calls `release()` to transfer equivalent assets to the user's wallet.



## Tech Stack

* **Smart Contracts:** Solidity v0.8.20, OpenZeppelin (ReentrancyGuard, Ownable, SafeERC20).

* **Backend:** Go (Golang), go-ethereum (geth) for RPC interaction.

* **Testing:** Hardhat for contract unit tests.



## Security Features

* **Reentrancy Protection:** All external state-changing functions are guarded with `nonReentrant`.

* **Nonce Tracking:** A unique nonce is generated for every deposit to prevent replay attacks on the destination chain.

* **Role-Based Access:** Only the authorized `Relayer` wallet can trigger the `release` function.



## Setup & Installation



### Smart Contracts

```bash

cd contracts

npm install

npx hardhat compile

npx hardhat test

