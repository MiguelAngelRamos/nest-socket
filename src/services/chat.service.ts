// src/services/chat.service.ts
import { Injectable } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { bufferTime, map } from 'rxjs/operators';

@Injectable()
export class ChatService {
  private messages: string[] = [];

  saveMessage(message: string) {
    this.messages.push(message);
  }

  getMessages(): Observable<string[]> {
    return of(this.messages);
  }

  getWindowedMessages(bufferTimeMs: number): Observable<string[]> {
    return from(this.messages).pipe(
      bufferTime(bufferTimeMs),
      map(messages => messages)
    );
  }
}
