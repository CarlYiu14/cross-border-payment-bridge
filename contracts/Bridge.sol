// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IBridge.sol"; // <--- NEW IMPORT

/**
 * @title Cross-Border Liquidity Bridge
 * @author Carl Yiu
 * @notice Facilitates cross-chain asset transfers by locking assets on the source chain.
 */
contract Bridge is ReentrancyGuard, Ownable, IBridge { // <--- ADDED "is IBridge"
    using SafeERC20 for IERC20;

    // --- State Variables ---
    uint256 public nonce;
    mapping(address => bool) public supportedTokens;
    mapping(uint256 => mapping(uint256 => bool)) public processedNonces;

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Locks tokens in the bridge contract.
     */
    function deposit(address _token, uint256 _amount, uint256 _targetChainId) external override nonReentrant { // <--- ADDED "override"
        if (!supportedTokens[_token]) revert TokenNotSupported();
        if (_amount == 0) revert InvalidAmount();

        nonce++;

        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        emit Deposit(msg.sender, _token, _amount, _targetChainId, nonce);
    }

    /**
     * @notice Releases tokens to the user.
     */
    function release(
        address _token, 
        uint256 _amount, 
        address _recipient, 
        uint256 _sourceChainId, 
        uint256 _sourceNonce
    ) external onlyOwner override nonReentrant { // <--- ADDED "override"
        if (processedNonces[_sourceChainId][_sourceNonce]) revert NonceAlreadyProcessed();
        
        processedNonces[_sourceChainId][_sourceNonce] = true;

        IERC20(_token).safeTransfer(_recipient, _amount);

        emit Release(_recipient, _token, _amount, _sourceChainId, _sourceNonce);
    }

    // --- Admin Functions ---
    function setTokenSupport(address _token, bool _status) external onlyOwner override { // <--- ADDED "override"
        supportedTokens[_token] = _status;
    }
}