import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgFor } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MessageComponentComponent } from '../../../common/message/message-component/message-component.component';
import { CustomSnackbarComponent } from '../../../common/custom-snackbar/custom-snackbar.component';
import { CalendarDialogComponent } from '../../../common/calendar-dialog/calendar-dialog.component';
import { FormsModule } from '@angular/forms';
import { TaskManagerComponentComponent } from '../../../common/task-manager-component/task-manager-component.component';
import { IUser } from '../../../../interfaces/iUser';
import { Task } from '../../../../interfaces/itask';
import { UserServiceService } from '../../../../service/user-service.service';
import { DashboardStudentService } from '../../../../service/dashboard-student.service';
import { TaskService } from '../../../../service/task.service';
import { ProgressResponse } from '../../../../interfaces/iProgressResponse';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Task_ejemplo } from '../../../../interfaces/iTask_1';
import { PendingTasksDialogComponent } from '../pending-tasks-dialog/pending-tasks-dialog.component';
import { TeacherServiceService } from '../../../../service/teacher-service.service';

@Component({
  selector: 'app-teacher-profile-component',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressBarModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatListModule,
    MatGridListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    NgxChartsModule,
  ],
  templateUrl: './teacher-profile-component.component.html',
  styleUrl: './teacher-profile-component.component.css'
})

export class TeacherProfileComponentComponent implements OnInit {
  serviceStudentDetails = inject(UserServiceService);
  serviceStudentProfile = inject(DashboardStudentService);
  taskService = inject(TaskService);
  teacherService = inject(TeacherServiceService);

  userId: number = 0; // Almacenamos el ID del usuario
  teacherProfile: IUser = {
    id: 0,
    name: '',
    email: '',
    details: {
      phone: '',
      address: '',
      img_url: '',
      description: ''
    }
  };
  arrCourses: ProgressResponse[] = [];

  tasks:Task_ejemplo [] = [];
  
  pendingTasksData = [
    { name: 'Pendientes', value: 10 },
    { name: 'Calificadas', value: 8 }
  ];
  
  
  

  

  // Fecha seleccionada
  selectedDate: Date | null = null;

  
  earningsData = [
    { name: 'Curso de Historia', value: 500 },
    { name: 'Curso de Matemáticas', value: 300 },
    { name: 'Curso de Ciencias', value: 450 }
  ];

  colorScheme: Color = {
    name: 'default',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  data = [
    {
      name: 'Estudiantes',
      value: 25 // Número total de alumnos del profesor
    }
  ];

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {}
  async ngOnInit() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.userId = user.id || 6; // asign id or use deafult value

      // call to services
      this.teacherProfile = await this.serviceStudentDetails.getUserDetails(this.userId);
      console.log(this.userId)
      
      this.arrCourses = await this.serviceStudentProfile.getProgressByUserId(this.userId);
    
  
      this.loadPendingTasksData(this.userId); // Llama a la función aquí

      // Llama al nuevo método para obtener el conteo de estudiantes
      const studentCountResponse = await this.teacherService.getStudentCount(this.userId);
      this.data = [
        {
          name: 'Estudiantes',
          value: studentCountResponse.studentCount // Actualiza el valor con la respuesta del servicio
        }
      ];
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }

  loadPendingTasksData(professorId: number) {
    this.teacherService.getTaskCounts(professorId).then(taskCounts => {
      this.pendingTasksData = [
        { name: 'Pendientes', value: taskCounts.pendingTasks },
        { name: 'Calificadas', value: taskCounts.gradedTasks }
      ];
    });
  }

  

  

  showCustomSnackBar(message: string): void { 
    // Abre la snackbar con el componente personalizado
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      duration: 3000,
      data: message,
      panelClass: ['custom-snackbar']
    });
  }
 
  updatePendingTasksData() {
    const pending = this.tasks.filter(task => task.status === 'Pendiente').length;
    const graded = this.tasks.length - pending;
    this.pendingTasksData = [
      { name: 'Pendientes', value: pending },
      { name: 'Calificadas', value: graded }
    ];
  }

  openPendingTasksDialog(): void {
    const pendingTasks = this.tasks.filter(task => task.status === 'Pendiente');
    const dialogRef = this.dialog.open(PendingTasksDialogComponent, {
      width: '600px',
      height:'600px', // Asegúrate de que el tamaño sea adecuado
      data: { tasks: pendingTasks },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showCustomSnackBar('Tarea revisada');
      }
    });
  }
 
}


