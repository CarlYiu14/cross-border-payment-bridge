package config

import (
	"log"
	"os"
)

type Config struct {
	RpcUrl          string
	ContractAddress string
	PrivateKey      string
}

func Load() *Config {
	rpc := os.Getenv("RPC_URL")
	if rpc == "" {
		log.Fatal("Error: RPC_URL environment variable is not set")
	}

	contract := os.Getenv("BRIDGE_CONTRACT_ADDRESS")
	if contract == "" {
		log.Fatal("Error: BRIDGE_CONTRACT_ADDRESS environment variable is not set")
	}

	// In a real production app, we would use a Secret Manager (e.g., AWS Secrets Manager)
	// instead of raw env vars for private keys.
	pk := os.Getenv("RELAYER_PRIVATE_KEY")
	if pk == "" {
		log.Fatal("Error: RELAYER_PRIVATE_KEY environment variable is not set")
	}

	return &Config{
		RpcUrl:          rpc,
		ContractAddress: contract,
		PrivateKey:      pk,
	}
}