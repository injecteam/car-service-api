// Packages
import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
// Services
import { AuthenticationService } from 'src/authentication/authentication.service';
// Entities
import { User } from './user.entity';
// Types
import { UserJwtPayload } from 'src/authentication/authentication.type';
// DTOs
import { SignUpRequestDTO, SignUpResponseDTO } from './dto/signup.dto';
import { SignInRequestDTO, SignInResponseDTO } from './dto/signin.dto';
import { FindAllResponseDTO } from './dto/find-all.dto';
import { FindByIdResponseDTO } from './dto/find-by-id.dto';
import { FindByEmailResponseDTO } from './dto/find-by-email.dto';
import { UpdateRequestDTO, UpdateResponseDTO } from './dto/update.dto';
import {
  UpdateRoleRequestDTO,
  UpdateRoleResponseDTO,
} from './dto/update-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async signUp(signUpRequestDTO: SignUpRequestDTO): Promise<SignUpResponseDTO> {
    try {
      const hashedPassword: string = await this.authenticationService.hashPassword(
        signUpRequestDTO.password,
      );
      const user: SignUpResponseDTO = this.userRepository.create(
        signUpRequestDTO,
      );
      user.password = hashedPassword;
      await this.userRepository.save(user);
      delete user.role;
      return user;
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('User with this email already exists.');
      throw new InternalServerErrorException();
    }
  }

  async signIn(signInRequestDTO: SignInRequestDTO): Promise<SignInResponseDTO> {
    try {
      const { email, password } = signInRequestDTO;
      const user: User = await this.userRepository.findOne({
        email,
      });
      if (!user) throw new UnauthorizedException('Invalid credentials.');
      const isValidPassword: boolean = await this.authenticationService.comparePasswords(
        password,
        user.password,
      );
      if (!isValidPassword)
        throw new UnauthorizedException('Invalid credentials.');
      const userJwtPayload: UserJwtPayload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email,
        role: user.role,
      };
      const jwt: string = await this.authenticationService.generateJWT(
        userJwtPayload,
      );
      return { access_token: jwt };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  async findAll(): Promise<FindAllResponseDTO[]> {
    try {
      const users: FindAllResponseDTO[] = await this.userRepository.find();
      if (!users.length) throw new InternalServerErrorException();
      users.forEach(user => delete user.role);
      return users;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findById(id: number): Promise<FindByIdResponseDTO> {
    try {
      const user: FindByIdResponseDTO = await this.userRepository.findOne(id);
      if (!user) throw new NotFoundException();
      delete user.role;
      return user;
    } catch (error) {
      if (error.code === 'P0002') throw new NotFoundException();
      throw new InternalServerErrorException();
    }
  }

  async findByEmail(email: string): Promise<FindByEmailResponseDTO> {
    try {
      const query = this.userRepository.createQueryBuilder('user');
      query.where('user.email = :email', { email });
      const user: FindByEmailResponseDTO = await query.getOne();
      if (!user) throw new NotFoundException();
      return user;
    } catch (error) {
      if (error.code === 'P0002') throw new NotFoundException();
      throw new InternalServerErrorException();
    }
  }

  async update(
    id: number,
    updateRequestDTO: UpdateRequestDTO,
  ): Promise<UpdateResponseDTO> {
    try {
      console.log('heree');
      const result: UpdateResult = await this.userRepository.update(
        id,
        updateRequestDTO,
      );
      const affected: number = result.affected;
      if (affected === 0) throw new NotFoundException();
      const user: UpdateResponseDTO = await this.userRepository.findOne(id);
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // TODO: Make 'delete' not delete but just mark entry as deleted
  async delete(id: number): Promise<number> {
    try {
      const result: DeleteResult = await this.userRepository.delete(id);
      const affected: number = result.affected;
      if (affected === 0) throw new NotFoundException();
      return affected;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateRole(
    id: number,
    updateRoleRequestDTO: UpdateRoleRequestDTO,
  ): Promise<UpdateRoleResponseDTO> {
    try {
      const result: UpdateResult = await this.userRepository.update(
        id,
        updateRoleRequestDTO,
      );
      const affected: number = result.affected;
      if (affected === 0) throw new NotFoundException();
      const user: UpdateRoleResponseDTO = await this.userRepository.findOne(id);
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
