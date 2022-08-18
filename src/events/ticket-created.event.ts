export class TicketCreatedEvent {
  constructor(
    public readonly title: string,
    public readonly description: string,
  ) {}
}
