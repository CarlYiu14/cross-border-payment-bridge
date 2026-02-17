# Decentralized Cross-Border Payment Bridge

## Overview
This repository contains the core infrastructure for a **Decentralized Cross-Border Payment Bridge**. The system is designed to facilitate secure, low-latency asset transfers between Ethereum-compatible networks (EVM).

This project consists of two main components:
1. **Smart Contracts (Solidity):** Handles the locking (custody) of assets on the source chain and the release of assets on the destination chain using a robust interface-driven design.
2. **Relayer Service (Go):** A modular, off-chain backend service that monitors blockchain events via WebSocket and orchestrates cross-chain settlement.

## Architecture
The bridge utilizes a **Lock-and-Release** mechanism:
* **Source Chain:** User calls `deposit()`. Assets are locked in the contract.
* **Off-Chain:** The Go Relayer detects the `Deposit` event via WebSocket subscription.
* **Destination Chain:** After block confirmations, the Relayer calls `release()` to transfer equivalent assets to the user's wallet.

## Tech Stack
* **Blockchain:** Solidity v0.8.20, OpenZeppelin, Hardhat.
* **Backend:** Go (Golang) v1.21, `go-ethereum` (Geth).
* **Infrastructure:** Docker, Makefile, GitHub Actions (CI/CD).
* **Security:** ReentrancyGuard, ECDSA, Nonce-tracking.

## Repository Structure
* `/contracts`: Solidity smart contracts and interfaces.
* `/backend`: Go relayer service including configuration and event listener logic.
* `/scripts`: Deployment and Etherscan verification scripts.
* `/test`: Comprehensive Hardhat unit tests for contract logic.
* `/.github/workflows`: Automated CI pipeline for contract testing and backend builds.

## Security Features
* **Interface-Driven Design:** Implementation strictly follows the `IBridge` interface for predictability and integration.
* **Reentrancy Protection:** All state-changing functions utilize `nonReentrant` modifiers.
* **Replay Attack Prevention:** Unique nonce tracking per chain ensures transactions cannot be duplicated.
* **Access Control:** Critical bridge functions are restricted to authorized relayer addresses.

## Setup & Installation

### Quick Start with Makefile
```bash
# Install all dependencies (Node & Go)
make install

# Compile contracts
make compile

# Run tests
make test
