import { IsEnum } from 'class-validator';
import { AuthorizationRole } from 'src/authorization/authorization-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleRequestDTO {
  @IsEnum(AuthorizationRole)
  @ApiProperty({
    type: String,
    enum: AuthorizationRole,
    description: 'role',
  })
  role: AuthorizationRole;
}
