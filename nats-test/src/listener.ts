import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    });

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('accounting-service');
    
    const subscription = stan.subscribe(
        'ticket:created', 
        'listener-queue-group', 
        options
    );

    subscription.on('message', (msg: Message) => {
        console.log('Listener', 'message received');

        const data = msg.getData();

        if (typeof data === 'string') {
            
        }

        msg.ack();//finally sends an acknowledgement to the server
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());