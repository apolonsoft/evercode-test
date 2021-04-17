import { EventEmitter } from 'events'
import { Injectable } from '@nestjs/common'
import { StrictEventEmitter, InjectEventEmitter } from 'nest-emitter'

interface AppEvents {
    initialisationCompleted: void
}

export type AppEventEmitter = StrictEventEmitter<EventEmitter, AppEvents>

@Injectable()
export class AppEventsService {
    constructor(@InjectEventEmitter() public emitter: AppEventEmitter) {}
}
