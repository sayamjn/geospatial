DB_NAME := geospatial_db
DB_USER := sayamjain
DB_HOST := localhost
DB_PORT := 5432

ensure-postgres:
	@echo "Ensuring PostgreSQL is running..."
	@brew services start postgresql@14 || true

create-tables:
	@echo "Ensuring tables exist..."
	@psql -h $(DB_HOST) -p $(DB_PORT) -U $(DB_USER) -d $(DB_NAME) -f sql/init.sql

setup-postgres: ensure-postgres create-tables
	@echo "PostgreSQL setup complete."

run:
	@echo "Running the Go application..."
	@go run cmd/server/main.go

.PHONY: ensure-postgres create-tables setup-postgres run