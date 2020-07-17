import { User } from './../auth/user.entity';
import { GetUser } from './../auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { TaskStatusValidationPipe } from './pipes/validation-pipes-transform';
import { FilterTasksDto } from './dto/filter-tasks-dto';
import { CreateTaskDto } from './dto/create-task-dto';
import { TasksService } from './tasks.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(
    @Inject('winston')
    private readonly logger: Logger = new Logger('TasksController'),
    private taskService: TasksService,
  ) {}

  @Get()
  getAllTasks(
    @Query(ValidationPipe) filterDto: FilterTasksDto,
  ): Promise<Task[]> {
    return this.taskService.getAllTasks(filterDto);
  }

  // @Get('/me')
  // getTasks(
  //   @Query(ValidationPipe) filterDto: FilterTasksDto,
  //   user: User,
  // ): Promise<Task[]> {
  //   this.logger.error('Fetched task');
  //   return this.taskService.getTasks(filterDto, user);
  // }

  @Get('/:id')
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number, user: User): void {
    // return this.taskService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateStatus(id, status, user);
  }
}
