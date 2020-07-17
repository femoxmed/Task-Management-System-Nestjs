import { TaskStatus } from '../task-status-enum';
import { IsOptional, IsIn, IsEmpty } from 'class-validator';

export class FilterTasksDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsEmpty()
  search: string;
}
