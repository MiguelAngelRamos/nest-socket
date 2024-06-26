// src/controllers/chat.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatService } from 'src/services/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  findAll(): Observable<string[]> {
    return this.chatService.getMessages();
  }

  @Get('windowed-messages')
  findWindowedMessages(): Observable<string[]> {
    return this.chatService.getWindowedMessages(4000); // Buffer time of 4000 ms (4 seconds)
  }
}
