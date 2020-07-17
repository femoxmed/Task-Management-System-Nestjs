import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRespository } from './task.respository';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRespository]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
