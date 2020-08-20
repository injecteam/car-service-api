import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';
import {
  SignUpRequestDTO,
  SignUpResponseDTO,
  FindByIdResponseDTO,
  FindByEmailResponseDTO,
  UpdateRequestDTO,
  UpdateResponseDTO,
} from './user.dto';
import { SignInRequestDTO, SignInResponseDTO } from 'src/auth/auth.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  signUp(
    @Body(new ValidationPipe({ whitelist: true }))
    signUpRequestDTO: SignUpRequestDTO,
  ): Promise<SignUpResponseDTO> {
    console.log(signUpRequestDTO);
    return this.userService.signUp(signUpRequestDTO);
  }

  @Post('signin')
  signIn(
    @Body() signInRequestDTO: SignInRequestDTO,
  ): Promise<SignInResponseDTO> {
    return this.userService.signIn(signInRequestDTO);
  }

  @Get('findbyemail')
  // @UseGuards(JwtAuthGuard)
  findByEmail(@Query('email') email: string): Promise<FindByEmailResponseDTO> {
    console.log(email);
    return this.userService.findByEmail(email);
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<FindByIdResponseDTO> {
    return this.userService.findById(id);
  }

  // @Roles('admin')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(): Promise<FindByIdResponseDTO[]> {
    return this.userService.findAll();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ whitelist: true }))
    updateRequestDTO: UpdateRequestDTO,
  ): Promise<UpdateResponseDTO> {
    return this.userService.update(id, updateRequestDTO);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteOne(@Param('id') id: number): Promise<number> {
    return this.userService.delete(id);
  }
}
