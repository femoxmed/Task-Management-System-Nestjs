import { NotFoundException } from '@nestjs/common';
import { FilterTasksDto } from './dto/filter-tasks-dto';
import { TaskRespository } from './task.respository';
import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';

const mockUser = { id: 3, username: 'test user' };
const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

describe('TaskService', () => {
  let tasksService;
  let taskRespository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRespository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRespository = await module.get<TaskRespository>(TaskRespository);
  });

  describe('getTasks', () => {
    it('get all task from the repository', async () => {
      taskRespository.getTasks.mockResolvedValue('someValue');

      expect(taskRespository.getTasks).not.toHaveBeenCalled();
      const filters: FilterTasksDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'some searc query',
      };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRespository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls the taskRepository.findOne(id) and successfully return a task', async (): Promise<
      Task
    > => {
      const mockTask = {
        title: 'Test Task',
        description: 'TestValue',
      };
      taskRespository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(1, mockUser);
      expect(taskRespository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
      return result;
    });

    it('throws an error if task not find', () => {
      taskRespository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() to a delete task', async () => {
      taskRespository.delete.mockResolvedValue({ affected: 1 });
      await tasksService.deleteTaskById(1, mockUser);
      expect(taskRespository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('throws a not found exception', async () => {
      taskRespository.delete.mockResolvedValue({ affected: 0 });

      expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(
        new NotFoundException(`Task with id ${1} not found`),
      );
    });
  });

  describe('updateTask', () => {
    it('calls taskRepository.update(id, status, user', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });
      await tasksService.updateStatus(1, TaskStatus.OPEN, mockUser);
      expect(tasksService.getTaskById).toHaveBeenCalledWith(1, mockUser);

      expect(save).toHaveBeenCalled();
      // expect(save).toHaveReturnedWith(true);
    });
  });
});
