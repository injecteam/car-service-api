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
import { AuthenticationJwtGuard } from 'src/authentication/jwtauth.guard';
import {
  SignUpRequestDTO,
  SignUpResponseDTO,
  FindByIdResponseDTO,
  FindByEmailResponseDTO,
  UpdateRequestDTO,
  UpdateResponseDTO,
  SignInRequestDTO,
  SignInResponseDTO,
} from './user.dto';
import { Roles } from 'src/authorization/roles.decorator';
import { OwnOrRoleGuard } from 'src/authorization/own-or-role.guard';
import { RoleGuard } from 'src/authorization/role.guard';
import { AuthorizationRole } from 'src/authorization/authorization-role.enum';
// import { RolesGuard } from 'src/roles/roles.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  signUp(
    @Body(new ValidationPipe({ whitelist: true }))
    signUpRequestDTO: SignUpRequestDTO,
  ): Promise<SignUpResponseDTO> {
    return this.userService.signUp(signUpRequestDTO);
  }

  @Post('signin')
  signIn(
    @Body() signInRequestDTO: SignInRequestDTO,
  ): Promise<SignInResponseDTO> {
    return this.userService.signIn(signInRequestDTO);
  }

  @Get('findbyemail')
  @Roles(AuthorizationRole.ADMIN)
  @UseGuards(AuthenticationJwtGuard, RoleGuard)
  findByEmail(@Query('email') email: string): Promise<FindByEmailResponseDTO> {
    return this.userService.findByEmail(email);
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<FindByIdResponseDTO> {
    return this.userService.findById(id);
  }

  @Get()
  findAll(): Promise<FindByIdResponseDTO[]> {
    return this.userService.findAll();
  }

  @Put(':id')
  @Roles(AuthorizationRole.ADMIN)
  @UseGuards(AuthenticationJwtGuard, OwnOrRoleGuard)
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ whitelist: true }))
    updateRequestDTO: UpdateRequestDTO,
  ): Promise<UpdateResponseDTO> {
    return this.userService.update(id, updateRequestDTO);
  }

  @Delete(':id')
  @Roles(AuthorizationRole.ADMIN)
  @UseGuards(AuthenticationJwtGuard, RoleGuard)
  deleteOne(@Param('id') id: number): Promise<number> {
    return this.userService.delete(id);
  }
}
