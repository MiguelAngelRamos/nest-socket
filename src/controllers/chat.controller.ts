//src/controllers/chat.controller.ts
import { Controller, Get } from "@nestjs/common";
import { Observable } from "rxjs";
import { ChatService } from "src/services/chat.service";

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get('messages')
  findAll(): Observable<string[]> {
    return this.chatService.getMessages();
  }
}