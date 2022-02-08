import { Publisher, Subjects, OrderCancelledEvent } from "@csticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}