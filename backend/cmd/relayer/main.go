package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"bridge/internal/config"
	"bridge/internal/listener"

	"github.com/ethereum/go-ethereum/ethclient"
)

func main() {
	// 1. Load Config
	cfg := config.Load()
	fmt.Println("Starting Kavodax Payment Bridge Relayer...")

	// 2. Connect to Client
	client, err := ethclient.Dial(cfg.RpcUrl)
	if err != nil {
		log.Fatalf("Failed to connect to Ethereum node: %v", err)
	}

	// 3. Start Listener Service
	bridgeListener := listener.NewBridgeListener(client, cfg.ContractAddress)
	
	// Graceful Shutdown Context
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go bridgeListener.Start(ctx)

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	fmt.Println("Shutting down relayer...")
}