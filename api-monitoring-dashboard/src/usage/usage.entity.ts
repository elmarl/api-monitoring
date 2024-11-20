import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { ApiKey } from '../api-keys/api-key.entity';

@Entity()
export class Usage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  method: string;

  @Column()
  endpoint: string;

  @Column()
  statusCode: number;

  @Column()
  responseTime: number;

  @Column()
  timestamp: Date;

  @ManyToOne(() => ApiKey, (apiKey) => apiKey.id, { onDelete: 'CASCADE' })
  @Index()
  apiKey: ApiKey;
}
