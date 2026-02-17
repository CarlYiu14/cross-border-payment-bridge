// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBridge {
    event Deposit(address indexed sender, address indexed token, uint256 amount, uint256 targetChainId, uint256 nonce);
    event Release(address indexed recipient, address indexed token, uint256 amount, uint256 sourceChainId, uint256 nonce);

    error TokenNotSupported();
    error InvalidAmount();
    error NonceAlreadyProcessed();

    function deposit(address _token, uint256 _amount, uint256 _targetChainId) external;
    function release(address _token, uint256 _amount, address _recipient, uint256 _sourceChainId, uint256 _sourceNonce) external;
    function setTokenSupport(address _token, bool _status) external;
}