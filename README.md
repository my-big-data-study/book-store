# simple-book-store
A book store that send orderCreated to Kafka

## How to run it?

Install the dependencies

```
(cd ui && npm i) && (cd api && npm i)
```

Run the application

```
npm run serve
```

or with Kafka as Event Bus

```
EVENT_BUS_ENABLED=TRUE KAFKA_HOST=127.0.0.1:9092 npm run serve
```
