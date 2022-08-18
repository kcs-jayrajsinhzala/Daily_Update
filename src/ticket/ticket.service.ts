import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { PrismaClient, User } from '@prisma/client';
import { Cache } from 'cache-manager';
import { CreateTicketDTO } from 'src/dto/createTicket.dto';
import { Ticket } from 'src/dto/ticket.dto';
import { TicketCreatedEvent } from 'src/events/ticket-created.event';

const prisma = new PrismaClient();

@Injectable()
export class TicketService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger(TicketService.name);

  async getHello() {
    await this.cacheManager.set('item', {
      name: 'jayrajsinh',
      email: 'zala@gmail.com',
    });
    // await this.cacheManager.reset();
    const items = await this.cacheManager.get('item');
    console.log('items', items);

    return 'hello';
  }

  //   @Cron('* * * * * *')
  //   async handle() {
  //     const items = await this.cacheManager.get('item');
  //     console.log('items', items);
  //   }

  async createTicket(body: CreateTicketDTO) {
    this.logger.log('Creating Ticket', body);
    this.eventEmitter.emit(
      'ticket.created',
      new TicketCreatedEvent(body.title, body.description),
    );
  }

  @OnEvent('ticket.created')
  newTicket(payload: TicketCreatedEvent) {
    this.logger.log('this is new ticket', { payload });
  }

  async addTicket(body: Ticket, user: User) {
    const data = {
      title: body.title,
      description: body.description,
      userId: user.id,
    };
    console.log(data);

    const ticket = await prisma.ticket.create({
      data: {
        title: body.title,
        description: body.description,
        userId: user.id,
      },
    });
    return ticket;
  }

  async getAllTickets() {
    const tickets = await prisma.ticket.findMany({});
    return tickets;
  }
}
