import { Publisher, Subjects, ExpirationCompleteEvent } from "@csticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;

}