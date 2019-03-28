const _ = require('koa-route');
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const kafka = require('kafka-node');

class EventBus {
    constructor(enabled) {
        this.enabled = enabled;
        if (this.enabled) {
            const kafkaHost = process.env.KAFKA_HOST;
            this.kafkaClient = new kafka.KafkaClient({kafkaHost: kafkaHost});
            this.producer = new kafka.Producer(kafkaClient)
        }
    }
    publish(event) {
        const message = JSON.stringify(event);
        console.log(`[publish-event] ${message}`);

        if (this.enabled) {
            this.producer.send([
                {topic: 'order_event', messages: message}
            ], (err, data) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    }
}

const EVENT_BUS_ENABLED = process.env.EVENT_BUS_ENABLED === "TRUE";

const eventBus = new EventBus(EVENT_BUS_ENABLED)

const orders = {
    create: (ctx) => {
        const body = ctx.request.body;
        const orderId = require('crypto').randomBytes(8).toString('hex');
        const delay = parseFloat(body.delay) || 0;
        const timestamp = new Date(new Date() - delay * 1000);

        const event = {
            timestamp: timestamp,
            type: 'orderCreated',
            payload: {
                orderId: orderId,
                items: body.items.map(item => {
                    return {
                        title: item.title,
                        quantity: item.quantity
                    }
                })
            }
        }

        eventBus.publish(event);

        ctx.body = {
            order: {
                id: orderId,
                timestamp: timestamp
            },
            status: "ok"
        }
    }
}

const index = {
    status: (ctx) => {
        ctx.body = {status: "ok"}
    }
}

const books = {
    index: (ctx) => {
        ctx.body = [
            {title: "Building a Scalable Data Warehouse with Data Vault 2.0"},
            {title: "Data Architecture: A Primer for the Data Scientist"},
            {title: "The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling, 3rd Edition"},
            {title: "Streaming Systems"},
            {title: "Introduction to Data Management Functions and Tools: IDMA 201 Course Textbook"},
        ]
    }
}
app.use(bodyParser());
app.use(_.post('/api/orders', orders.create));
app.use(_.get('/api/books', books.index));
app.use(_.get('/api/status', index.status));

app.listen(5000);