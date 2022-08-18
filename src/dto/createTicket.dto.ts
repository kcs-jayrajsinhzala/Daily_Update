import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTicketDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
