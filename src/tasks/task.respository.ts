import { User } from './../auth/user.entity';
import { FilterTasksDto } from './dto/filter-tasks-dto';
import { TaskStatus } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Task)
export class TaskRespository extends Repository<Task> {
  async getAllTasks(filterDto: FilterTasksDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search)
      query.andWhere('task.title LIKE :search OR task.title LIKE :search', {
        search,
      });
    return query.getMany();
  }

  async getTasks(filterDto: FilterTasksDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userid = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search)
      query.andWhere('task.title LIKE :search OR task.title LIKE :search', {
        search,
      });
    return query.getMany();
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    let task = this.create({
      title,
      description,
      user,
      status: TaskStatus.OPEN,
    });

    await task.save();
    delete task.user;
    return task;
  }
}
