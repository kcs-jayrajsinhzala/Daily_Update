import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUp } from './dto/user.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  constructor(private jwt: JwtService) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('Called when the current second is 10');
  }

  async signup(dto: SignUp) {
    const hash = await argon.hash(dto.password);

    const userDetails = await prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (userDetails) {
      throw new HttpException(
        'this email is already used',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hash,
      },
    });
    delete user.password;

    return user;
  }
  async signin(dto: SignUp) {
    const user: User = await prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new HttpException('user not found', HttpStatus.FORBIDDEN);

    const matchPass = await argon.verify(user.password, dto.password);

    if (!matchPass)
      throw new HttpException('invalid password', HttpStatus.FORBIDDEN);
    delete user.password;
    console.log(typeof user.id);

    const token = await this.signToken(user.id, user.email);

    return { user, token };
  }

  signToken(userId: number, email: string): Promise<string> {
    const payload = {
      id: userId,
      email,
    };
    const token = this.jwt.signAsync(payload, {
      expiresIn: '30min',
      secret: process.env.JWT_SECRET,
    });

    return token;
  }
}
