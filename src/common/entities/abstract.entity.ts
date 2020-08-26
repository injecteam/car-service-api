import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('increment')
  // TODO: Describe API property (swagger stuff)
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  // TODO: Describe API property (swagger stuff)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  // TODO: Describe API property (swagger stuff)
  updatedAt: Date;
}
