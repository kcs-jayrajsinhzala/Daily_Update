import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TicketController } from './ticket/ticket.controller';
import { TicketService } from './ticket/ticket.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    JwtModule.register({}),
  ],
  controllers: [AppController, TicketController],
  providers: [AppService, JwtStrategy, TicketService],
})
export class AppModule {}
