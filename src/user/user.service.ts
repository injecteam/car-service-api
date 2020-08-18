import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateRequestDto } from './dto/update-request.dto';
import { SignInRequestDto } from 'src/auth/dto/sign-in-request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async signUp(signUpRequestDto: SignUpRequestDto): Promise<void> {
    try {
      const hashedPassword = await this.authService.hashPassword(
        signUpRequestDto.password,
      );
      const user = Object.assign({}, { ...signUpRequestDto });
      user.password = hashedPassword;
      await this.userRepository.save(user);
    } catch (error) {
      // TODO: Error handling
      if (error.code === '23505')
        throw new ConflictException('User with this email already exists');
      throw new InternalServerErrorException();
    }
  }

  async signIn(signInRequestDto: SignInRequestDto): Promise<string> {
    try {
      const { email, password } = signInRequestDto;
      const user = await this.userRepository.findOne({ email });
      if (!user) throw new UnauthorizedException();
      const passwordsMath = await this.authService.comparePasswords(
        password,
        user.password,
      );
      if (!passwordsMath) throw new UnauthorizedException();
      const jwt = await this.authService.generateJWT(signInRequestDto);
      return jwt;
    } catch (error) {
      // TODO: Error handling
      if (error.code === 'P0002') throw new NotFoundException();
      throw error;
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) throw new NotFoundException();
      delete user.password;
      return user;
    } catch (error) {
      // TODO: Error handling
      if (error.code === 'P0002') throw new NotFoundException();
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const query = this.userRepository.createQueryBuilder('user');
      query.where('user.email = :email', { email });
      const user = await query.getOne();
      if (!user) throw new NotFoundException();
      delete user.password;
      return user;
    } catch (error) {
      // TODO: Error handling
      if (error.code === 'P0002') throw new NotFoundException();
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();
      if (!users) throw new NotFoundException();
      users.forEach(user => {
        delete user.password;
      });
      return users;
    } catch (error) {
      // TODO: Error handling
      if (error.code === 'P0002') throw new NotFoundException();
      throw error;
    }
  }

  async update(
    id: number,
    updateRequestDto: UpdateRequestDto,
  ): Promise<number> {
    try {
      const result = await this.userRepository.update(id, updateRequestDto);
      return result.affected;
    } catch (error) {
      // TODO: Error handling
      console.error(error);
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const result = await this.userRepository.delete(id);
      return result.affected;
    } catch (error) {
      // TODO: Error handling
      console.error(error);
    }
  }
}
