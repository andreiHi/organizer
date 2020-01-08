import { Component, OnInit } from '@angular/core';
import {DateService} from '../shared/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Task, TasksService} from '../shared/tasks.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  tasks: Task[] = [];
  form: FormGroup;
  constructor(private dataService: DateService, private tasksService: TasksService) { }

  ngOnInit() {
    this.dataService.date.pipe(  // при изменении даты подгружаем новые данные с бд
      switchMap(value => this.tasksService.load(value))
    ).subscribe(tasks => this.tasks = tasks);
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit() {
    const {title} = this.form.value;
    const task: Task = {
      title,
      date: this.dataService.date.value.format('DD-MM-YYYY')
    };
    this.tasksService.create(task)
      .subscribe(res => {
          this.tasks.push(task);
          console.log('New task', res);
          this.form.reset();
        }, error => console.log(error)
      );
  }


  removeTask(task: Task) {
    this.tasksService.remove(task).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
      },
      error => console.error(error));
  }
}
