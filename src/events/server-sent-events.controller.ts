import { Controller, Sse } from "@nestjs/common";
import { Observable } from "rxjs";
import { ServerSentEventsService } from "./server-sent-events.service";
import { TipEventInterface } from "./tip-event.interface";

@Controller()
export class ServerSentEventsController {

  constructor(private readonly sseService: ServerSentEventsService) {
  }

  @Sse("events") eventsEmitter(): Observable<TipEventInterface> {
    return this.sseService.getEvents();
  }
}
