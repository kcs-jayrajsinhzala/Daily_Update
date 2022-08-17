import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TicketController } from './ticket/ticket.controller';

@Module({
  imports: [ConfigModule.forRoot(), JwtModule.register({})],
  controllers: [AppController, TicketController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
