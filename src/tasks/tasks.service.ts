import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { TaskRespository } from './task.respository';
import { FilterTasksDto } from './dto/filter-tasks-dto';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './task-status-enum';
import { Injectable, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRespository)
    private taskRespository: TaskRespository,
  ) {}
  // private tasks: Task[] = [];
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRespository.createTask(createTaskDto, user);
  }

  getAllTasks(filterDto: FilterTasksDto): Promise<Task[]> {
    return this.taskRespository.getAllTasks(filterDto);
  }

  getTasks(filterDto: FilterTasksDto, user: User): Promise<Task[]> {
    return this.taskRespository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    let found;
    if (user.isAdmin) {
      found = await this.taskRespository.findOne(id);
    } else {
      found = await this.taskRespository.findOne({
        where: { id, userId: user.id },
      });
    }
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    // let item = await this.getTaskById(id); // when using remove we have to check first
    let deleted: any;
    if (user.isAdmin) {
      deleted = await this.taskRespository.delete(id);
    } else {
      deleted = await this.taskRespository.delete({ id: id, userId: user.id });
    }
    if (deleted.affected === 0)
      throw new NotFoundException(`Task with id ${id} not found`);
  }

  // @patch service
  async updateStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
    // return task;
  }
}
