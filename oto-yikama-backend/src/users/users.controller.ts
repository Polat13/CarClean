import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto'; // Bunu eklemeyi unutma

@Controller('users') 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST http://localhost:3000/users/register
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // POST http://localhost:3000/users/login
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.loginUser(loginUserDto);
  }
}