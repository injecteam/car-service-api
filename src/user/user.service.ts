import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SignUpRequestDTO,
  SignUpResponseDTO,
  FindByIdResponseDTO,
  FindByEmailResponseDTO,
  UpdateResponseDTO,
  SignInRequestDTO,
  SignInResponseDTO,
  FindAllResponseDTO,
  UpdateRoleRequestDTO,
  UpdateRoleResponseDTO,
} from './user.dto';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { User } from './user.entity';
import { Repository, DeleteResult } from 'typeorm';
import { UpdateRequestDTO } from './user.dto';
import { UserJwtPayload } from 'src/authentication/authentication.type';

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
      return user;
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('User with this email already exists');
      throw new InternalServerErrorException();
    }
  }

  async signIn(signInRequestDTO: SignInRequestDTO): Promise<SignInResponseDTO> {
    try {
      const { email, password } = signInRequestDTO;
      const user: User = await this.userRepository.findOne({
        email,
      });
      if (!user) throw new UnauthorizedException('Invalid credentials');
      const isValidPassword: boolean = await this.authenticationService.comparePasswords(
        password,
        user.password,
      );
      if (!isValidPassword)
        throw new UnauthorizedException('Invalid credentials');
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
      throw new UnauthorizedException('Invalid credentials');
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

  async findAll(): Promise<FindAllResponseDTO[]> {
    try {
      const users: FindAllResponseDTO[] = await this.userRepository.find();
      if (!users) throw new NotFoundException();
      users.forEach(user => delete user.role);
      return users;
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
      await this.userRepository.update(id, updateRequestDTO);
      const user: UpdateResponseDTO = await this.userRepository.findOne(id);
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const result: DeleteResult = await this.userRepository.delete(id);
      const affected: number | null = result.affected;
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
      await this.userRepository.update(id, updateRoleRequestDTO);
      const user: UpdateRoleResponseDTO = await this.userRepository.findOne(id);
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
