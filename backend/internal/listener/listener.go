package listener

import (
	"context"
	"fmt"
	"log"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

type BridgeListener struct {
	client          *ethclient.Client
	contractAddress common.Address
}

func NewBridgeListener(client *ethclient.Client, address string) *BridgeListener {
	return &BridgeListener{
		client:          client,
		contractAddress: common.HexToAddress(address),
	}
}

// Start listens for Deposit events on the blockchain
func (bl *BridgeListener) Start(ctx context.Context) {
	query := ethereum.FilterQuery{
		Addresses: []common.Address{bl.contractAddress},
	}

	logs := make(chan types.Log)
	sub, err := bl.client.SubscribeFilterLogs(ctx, query, logs)
	if err != nil {
		log.Fatalf("Failed to subscribe to logs: %v", err)
	}

	fmt.Println("Listening for Deposit events...")

	for {
		select {
		case err := <-sub.Err():
			log.Printf("Subscription error: %v", err)
			// TODO: Implement retry logic here for robustness
			return
		case vLog := <-logs:
			bl.handleLog(vLog)
		case <-ctx.Done():
			return
		}
	}
}

func (bl *BridgeListener) handleLog(vLog types.Log) {
	fmt.Printf("Received log in block: %d\n", vLog.BlockNumber)
	fmt.Printf("Tx Hash: %s\n", vLog.TxHash.Hex())

	// TODO: Decode log data using ABI
	// In production, we would use the generated Go bindings (abigen) here
}
