import { Module } from '@nestjs/common';
import { PlatformClientService } from './platform-client.service';

@Module({
  providers: [PlatformClientService],
  exports: [PlatformClientService],
})
export class BackendModule {}


