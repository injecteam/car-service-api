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
  UseInterceptors,
  ClassSerializerInterceptor,
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
  UpdateRoleRequestDTO,
  UpdateRoleResponseDTO,
  FindAllResponseDTO,
} from './user.dto';
import { Roles } from 'src/authorization/roles.decorator';
import { OwnOrRoleGuard } from 'src/authorization/own-or-role.guard';
import { RoleGuard } from 'src/authorization/role.guard';
import { AuthorizationRole } from 'src/authorization/authorization-role.enum';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  signUp(
    @Body(new ValidationPipe({ whitelist: true }))
    signUpRequestDTO: SignUpRequestDTO,
  ): Promise<SignUpResponseDTO> {
    return this.userService.signUp(signUpRequestDTO);
  }

  @Post('signin')
  signIn(
    @Body(new ValidationPipe({ whitelist: true }))
    signInRequestDTO: SignInRequestDTO,
  ): Promise<SignInResponseDTO> {
    return this.userService.signIn(signInRequestDTO);
  }

  @Get('findbyemail')
  @Roles(AuthorizationRole.ADMIN)
  @UseGuards(AuthenticationJwtGuard, RoleGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  findByEmail(@Query('email') email: string): Promise<FindByEmailResponseDTO> {
    return this.userService.findByEmail(email);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findById(@Param('id') id: number): Promise<FindByIdResponseDTO> {
    return this.userService.findById(id);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(): Promise<FindAllResponseDTO[]> {
    return this.userService.findAll();
  }

  @Put(':id')
  @Roles(AuthorizationRole.ADMIN)
  @UseGuards(AuthenticationJwtGuard, OwnOrRoleGuard)
  @UseInterceptors(ClassSerializerInterceptor)
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

  @Put(':id/role')
  @Roles(AuthorizationRole.SUPER)
  @UseGuards(AuthenticationJwtGuard, RoleGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  updateRole(
    @Param('id') id: number,
    @Body(new ValidationPipe({ whitelist: true }))
    updateRoleRequestDTO: UpdateRoleRequestDTO,
  ): Promise<UpdateRoleResponseDTO> {
    return this.userService.updateRole(id, updateRoleRequestDTO);
  }
}
