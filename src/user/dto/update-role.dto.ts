import { IsEnum } from 'class-validator';
import { AuthorizationRole } from 'src/authorization/authorization-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UpdateRoleRequestDTO {
  @IsEnum(AuthorizationRole)
  @ApiProperty({
    type: String,
    enum: AuthorizationRole,
    description: 'role',
  })
  role: AuthorizationRole;
}

export class UpdateRoleResponseDTO extends User {}
