import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileCount } from './entities/fileCount.entity';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileCount])],
  providers: [
    FileResolver, //
    FileService,
  ],
})
export class FileModule {}
