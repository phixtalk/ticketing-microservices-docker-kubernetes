import mongoose from 'mongoose';
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it('should mark an order as cancelled', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    });
    await ticket.save();

    const user = global.signin();
    // Make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

     // Make request to cancel the orders
     await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);

    // expect the order to be cancelled
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('should emit an order cancelled event', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    });
    await ticket.save();

    const user = global.signin();
    // Make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

     // Make request to cancel the orders
     await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
