import { Injectable } from "@nestjs/common";
import { Observable, bufferTime, concatMap, from, map, of } from "rxjs";

@Injectable()
export class ChatService {

  private messages: string [] = [];

  constructor() {
    this.sendWelcomeMessage()
  }

  saveMessage(message: string): void {
    this.messages.push(message);
  }

  // findAll(): Observable<string[]> {
  //   return of(this.messages);
  // }

  getMessages(): Observable<string[]> {
    return of(this.messages);
  }

  getWindowedMessage(bufferTimeMs: number): Observable<string[]> {
    return from(this.messages).pipe(
      bufferTime(bufferTimeMs),
      map(messages => messages)
    );
  }

  processMessage(message: string): Observable<string[]> {
    return of(message).pipe(
      map(msg => `Process: ${msg}`),
      concatMap(msg => from([msg, msg.toUpperCase()])),
      bufferTime(1000)
    )
  }

  sendWelcomeMessage(): void {
    const welcomeMessage = 'Bienvenido(a) al Chat con Rxjs y Socket.io';
    this.saveMessage(welcomeMessage);
  }
}