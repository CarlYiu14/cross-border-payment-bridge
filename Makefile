.PHONY: all test clean deploy-contracts run-relayer

all: install build

# --- Setup ---
install:
	npm install
	cd backend && go mod tidy

# --- Smart Contracts ---
compile:
	npx hardhat compile

test:
	npx hardhat test

deploy-sepolia:
	npx hardhat run scripts/deploy.js --network sepolia

# --- Backend ---
build-relayer:
	cd backend && go build -o bin/relayer cmd/relayer/main.go

run-relayer:
	cd backend && go run cmd/relayer/main.go

docker-build:
	cd backend && docker build -t kavodax-relayer .

# --- Utilities ---
clean:
	rm -rf artifacts cache backend/bin