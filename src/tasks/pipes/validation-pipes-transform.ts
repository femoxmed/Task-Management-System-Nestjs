import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status-enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value, metadata) {
    if (!this.isStatusValid(value))
      throw new BadRequestException(
        `The only status are ${(TaskStatus.OPEN,
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS)}`,
      );
    return value;
  }

  private isStatusValid(status: any) {
    let check = this.allowedStatuses.indexOf(status);
    return check !== -1;
  }
}
