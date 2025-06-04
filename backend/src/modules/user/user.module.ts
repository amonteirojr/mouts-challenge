import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './presentation/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm/repositories/user.repository';
import { User } from './infrastructure/persistence/typeorm/entities/user.entity';
import { SharedCacheModule } from '../../shared/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SharedCacheModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'USER_REPOSITORY',
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule { } 