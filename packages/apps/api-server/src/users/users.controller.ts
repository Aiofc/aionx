import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '@aionx/data-access-admin';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() user: CreateUserDto) {
    this.userService.createUser(user);
  }

  @Get()
  findAll() {
    return this.userService.getUsers();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
}
