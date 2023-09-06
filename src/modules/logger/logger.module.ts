import { DynamicModule, Module } from '@nestjs/common';
import { CustomLoggerService } from './service/logger.service';

@Module({})
export class CustomLoggerModule {
  static forRoot({ isGlobal = false }): DynamicModule {
    return {
      module: CustomLoggerModule,
      providers: [CustomLoggerService],
      exports: [CustomLoggerService],
      global: isGlobal,
    };
  }
}
