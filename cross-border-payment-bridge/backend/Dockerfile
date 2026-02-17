# Build Stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy dependency files first for better caching
COPY go.mod ./
COPY go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the binary
RUN go build -o relayer cmd/relayer/main.go

# Run Stage
FROM alpine:latest

WORKDIR /root/

# Install CA certificates for HTTPS calls (Infura/Alchemy)
RUN apk --no-cache add ca-certificates

COPY --from=builder /app/relayer .
COPY --from=builder /app/.env . 

# Expose port (if you add an API later)
EXPOSE 8080

CMD ["./relayer"]