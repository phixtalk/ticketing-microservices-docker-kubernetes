import { Listener, OrderCreatedEvent, Subjects } from "@csticket/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        console.log(`waiting for ${delay} milliseconds`);
        

        //start a job with a delay 
        await expirationQueue.add({
            orderId: data.id
        },{
            delay
        });        

        msg.ack();
    }
}