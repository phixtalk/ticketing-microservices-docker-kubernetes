import { Publisher, Subjects, TicketUpdatedEvent } from "@csticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}