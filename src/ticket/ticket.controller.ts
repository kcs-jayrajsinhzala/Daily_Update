import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorator/getUser.decorator';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('ticket')
export class TicketController {
  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  getTickets(@GetUser() user: User) {
    console.log(user);

    return user;
  }
}
