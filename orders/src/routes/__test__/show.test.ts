import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";


it('should fetch the order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 10
    });
    await ticket.save();

    const user = global.signin();

    // Make a request to build an order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make request to fetch the orders
    const { body: fetchOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(200);    

    expect(fetchOrder.id).toEqual(order.id);
});

it('returns an error if a user tries to fetch another users order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 10
    });
    await ticket.save();

    const user = global.signin();

    // Make a request to build an order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make request to fetch the orders
    const { body: fetchOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .expect(401);
});