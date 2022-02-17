import { PaymentCreatedEvent, Publisher, Subjects } from "@csticket/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}