import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
})
export class UsageGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private redisService: RedisService,
    private jwtService: JwtService,
  ) {}

  private clients = new Map<string, string>();

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;

      if (!token) {
        console.error('No token provided');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      this.clients.set(client.id, userId);
      // Add client to a room identified by their userId
      client.join(userId);

      console.log(`Client connected: ${userId}`);
    } catch (error) {
      console.error('Socket connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.clients.get(client.id);

    if (userId) {
      console.log(`Client disconnected: userId=${userId}`);
      this.clients.delete(client.id);
    }
  }

  onModuleInit() {
    this.redisService.subscribe('usage', (message: string) => {
      const parsedMessage = JSON.parse(message);
      this.server.to(parsedMessage.userId).emit('usage', parsedMessage.usage);
    });
  }
}
