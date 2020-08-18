import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { JwtAuthGuard } from 'src/auth/jwtauth.guard';
// import { RolesGuard } from 'src/common/guards/roles.guard';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { FindByEmailRequestDto } from './dto/find-by-email-request.dto';
import { User } from './entities/user.entity';
import { UpdateRequestDto } from './dto/update-request.dto';
import { SignInRequestDto } from 'src/auth/dto/sign-in-request.dto';
import { SignInResponseDto } from 'src/auth/dto/sign-in-response.dto';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  signUp(@Body() signUpRequestDto: SignUpRequestDto): Promise<void> {
    return this.userService.signUp(signUpRequestDto);
  }

  @Post('signin')
  async signIn(
    @Body() signInRequestDto: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    const jwt = await this.userService.signIn(signInRequestDto);
    return { access_token: jwt };
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Post('findbyemail')
  findByEmail(
    @Body() findByEmailRequestDto: FindByEmailRequestDto,
  ): Promise<User> {
    const { email } = findByEmailRequestDto;
    return this.userService.findByEmail(email);
  }

  // @Roles('admin')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateRequestDto: UpdateRequestDto,
  ): Promise<number> {
    return this.userService.update(id, updateRequestDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number): Promise<number> {
    return this.userService.delete(id);
  }
}
