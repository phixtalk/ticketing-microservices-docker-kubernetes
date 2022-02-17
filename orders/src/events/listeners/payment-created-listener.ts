import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@csticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Complete
        });
        await order.save();

        // note that whenever we update a model, we automatically update
        // its version, so ideally we should publish an event to notify 
        // other service of this update,but here, the order is completed,
        // since it has been paid for, so no need to publish another event

        msg.ack();
    }
}