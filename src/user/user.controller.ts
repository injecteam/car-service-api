// Packages
import {
  Post,
  Body,
  Get,
  Put,
  Query,
  Param,
  Delete,
  UseGuards,
  Controller,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
// Services
import { UserService } from './user.service';
// Guards
import { RoleGuard } from 'src/authorization/role.guard';
import { OwnOrRoleGuard } from 'src/authorization/own-or-role.guard';
import { AuthenticationJwtGuard } from 'src/authentication/jwtauth.guard';
// Decorators
import { Roles } from 'src/authorization/roles.decorator';
// Enums
import { AuthorizationRole } from 'src/authorization/authorization-role.enum';
// DTOs
import { SignUpRequestDTO } from './dto/signup.dto';
import { SignInRequestDTO, SignInResponseDTO } from './dto/signin.dto';
import { FindAllResponseDTO } from './dto/find-all.dto';
import { FindByIdResponseDTO } from './dto/find-by-id.dto';
import { FindByEmailResponseDTO } from './dto/find-by-email.dto';
import { UpdateRequestDTO, UpdateResponseDTO } from './dto/update.dto';
import {
  UpdateRoleRequestDTO,
  UpdateRoleResponseDTO,
} from './dto/update-role.dto';
import { User } from './user.entity';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: SignUpRequestDTO })
  @ApiCreatedResponse({
    description: 'User has been successfully registered.',
  })
  @ApiConflictResponse({ description: 'User with this email already exists.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  // TODO: Describe API response content DTO (swagger stuff)
  signUp(
    @Body(new ValidationPipe({ whitelist: true }))
    signUpRequestDTO: SignUpRequestDTO,
  ): Promise<User> {
    return this.userService.signUp(signUpRequestDTO);
  }

  @Get('confirm/:uuid')
  @ApiOkResponse({
    description: 'User has been successfully confirmed.',
  })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  // TODO: Describe API response content DTO (swagger stuff)
  confirm(@Param('uuid') uuid: string): Promise<string> {
    console.log(uuid);
    return this.userService.confirm(uuid);
  }

  @Post('signin')
  @ApiBody({ type: SignInRequestDTO })
  @ApiOkResponse({ description: 'User has been successfully logged in.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  // TODO: Describe API response content DTO (swagger stuff)
  signIn(
    @Body(new ValidationPipe({ whitelist: true }))
    signInRequestDTO: SignInRequestDTO,
  ): Promise<SignInResponseDTO> {
    return this.userService.signIn(signInRequestDTO);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Users have been successfully returned.' })
  @ApiInternalServerErrorResponse()
  // TODO: Describe API response content DTO (swagger stuff)
  findAll(): Promise<FindAllResponseDTO[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'User has been successfully returned.' })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  // TODO: Describe API response content DTO (swagger stuff)
  findById(@Param('id') id: number): Promise<FindByIdResponseDTO> {
    return this.userService.findById(id);
  }

  @Get('findbyemail')
  @Roles(AuthorizationRole.SUPER, AuthorizationRole.ADMIN)
  @UseGuards(AuthenticationJwtGuard, RoleGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User has been successfully returned.' })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  // TODO: Describe API response content DTO (swagger stuff)
  findByEmail(@Query('email') email: string): Promise<FindByEmailResponseDTO> {
    return this.userService.findByEmail(email);
  }

  @Put(':id')
  @Roles(AuthorizationRole.SUPER, AuthorizationRole.ADMIN)
  @UseGuards(AuthenticationJwtGuard, OwnOrRoleGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User has been successfully updated.' })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  // TODO: Describe API response content DTO (swagger stuff)
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ whitelist: true }))
    updateRequestDTO: UpdateRequestDTO,
  ): Promise<UpdateResponseDTO> {
    return this.userService.update(id, updateRequestDTO);
  }

  // TODO: Make 'delete' not delete but just mark entry as deleted
  @Delete(':id')
  @Roles(AuthorizationRole.SUPER, AuthorizationRole.ADMIN)
  @UseGuards(AuthenticationJwtGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User has been successfully deleted.' })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  // TODO: Describe API response content DTO (swagger stuff)
  deleteOne(@Param('id') id: number): Promise<number> {
    return this.userService.delete(id);
  }

  @Put(':id/role')
  @Roles(AuthorizationRole.SUPER)
  @UseGuards(AuthenticationJwtGuard, RoleGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User (role) has been successfully updated.' })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  // TODO: Describe API response content DTO (swagger stuff)
  updateRole(
    @Param('id') id: number,
    @Body(new ValidationPipe({ whitelist: true }))
    updateRoleRequestDTO: UpdateRoleRequestDTO,
  ): Promise<UpdateRoleResponseDTO> {
    return this.userService.updateRole(id, updateRoleRequestDTO);
  }
}
