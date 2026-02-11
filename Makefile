.PHONY: install dev build clean test lint format

install:
	npm install

dev:
	npm run dev

dev-server:
	npm run dev:server

dev-client:
	npm run dev:client

build:
	npm run build

clean:
	npm run clean

test:
	npm test

lint:
	npm run lint

format:
	npm run format

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

seed:
	npm run seed --workspace=server
```

## `.dockerignore`
```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
dist
build
coverage
.turbo
README.md