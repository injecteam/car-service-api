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
} from './user.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateRequestDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async signUp(signUpRequestDTO: SignUpRequestDTO): Promise<SignUpResponseDTO> {
    try {
      const hashedPassword = await this.authService.hashPassword(
        signUpRequestDTO.password,
      );
      const user = this.userRepository.create(signUpRequestDTO);
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
      const user = await this.userRepository.findOne({ email });
      if (!user) throw new UnauthorizedException('Invalid credentials');
      const isValidPassword = await this.authService.comparePasswords(
        password,
        user.password,
      );
      if (!isValidPassword)
        throw new UnauthorizedException('Invalid credentials');
      const userJwtPayload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email,
      };
      const jwt = await this.authService.generateJWT(userJwtPayload);
      return { access_token: jwt };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async findById(id: number): Promise<FindByIdResponseDTO> {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) throw new NotFoundException();
      delete user.password;
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
      const user = await query.getOne();
      if (!user) throw new NotFoundException();
      delete user.password;
      return user;
    } catch (error) {
      if (error.code === 'P0002') throw new NotFoundException();
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<FindByIdResponseDTO[]> {
    try {
      const users = await this.userRepository.find();
      if (!users) throw new NotFoundException();
      users.forEach(user => {
        delete user.password;
      });
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
      const user = await this.userRepository.findOne(id);
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const result = await this.userRepository.delete(id);
      return result.affected;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
