import { Injectable } from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import { Tip } from "../schema/tip.embedded";
import { TipEventInterface } from "./tip-event.interface";

@Injectable()
export class ServerSentEventsService {

  private messagingSubject: Subject<TipEventInterface> = new Subject();

  getEvents(): Observable<TipEventInterface> {
    return this.messagingSubject;
  }

  pushTipEvent(tip: Tip) {
    this.messagingSubject.next({data: tip});
  }
}
