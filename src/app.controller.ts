import { Body, Controller, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { SignUp } from './dto/user.dto';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('signup')
  signup(@Body() dto: SignUp) {
    return this.appService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: SignUp) {
    return this.appService.signin(dto);
  }
}
