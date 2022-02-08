import { Publisher, Subjects, OrderCreatedEvent } from "@csticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}