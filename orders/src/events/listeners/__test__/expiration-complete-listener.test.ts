import mongoose from "mongoose";
import { ExpirationCompleteEvent, OrderStatus } from "@csticket/common";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";

const setup = async () => {
    // create an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
    });

    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'sdsadf',
        expiresAt: new Date(),
        ticket,
    });
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, ticket, order };
};

it('should update the order status to cancel', async () => {
  const { listener, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('should an order cancelled event', async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data, msg);
  
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
  
    expect(msg.ack).toHaveBeenCalled();
});
  
