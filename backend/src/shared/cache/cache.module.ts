import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { Cache } from 'cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        try {
          return {
            store: redisStore,
            host: 'localhost',
            port: 6379,
            ttl: 60 * 60 * 24,
          };
        } catch (error) {
          console.warn('Redis not available, falling back to memory cache');
          return {
            ttl: 60 * 60 * 24,
          };
        }
      },
    }),
  ],
  exports: [CacheModule],
})
export class SharedCacheModule { }    