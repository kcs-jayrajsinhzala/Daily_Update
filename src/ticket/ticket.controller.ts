import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Logger,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { diskStorage } from 'multer';
import path from 'path';
import { GetUser } from 'src/decorator/getUser.decorator';
import { CreateTicketDTO } from 'src/dto/createTicket.dto';
import { Ticket } from 'src/dto/ticket.dto';
import { v4 as uuid4 } from 'uuid';
import { TicketService } from './ticket.service';

// @UseInterceptors(LoggingInterceptor)
@UseInterceptors(CacheInterceptor)
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async getHello() {
    return this.ticketService.getHello();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  getTickets() {
    // console.log(user);

    return this.ticketService.getAllTickets();
  }

  @Post()
  async createTicket(@Body() body: CreateTicketDTO) {
    return this.ticketService.createTicket(body);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuid4();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file) {
    return { file };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  AddTicket(@GetUser() user: User, @Body() body: Ticket) {
    return this.ticketService.addTicket(body, user);
  }
}
