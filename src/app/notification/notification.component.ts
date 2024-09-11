

import { Component, Inject, OnInit } from '@angular/core';
import {AfterViewInit,ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

import {MatButtonModule} from '@angular/material/button';
import { DialogDataExampleDialog } from '../dialog-data-example-dialog/dialog-data-example-dialog.component';
export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule,CommonModule,MatButtonModule ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})

export class NotificationComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'subject',
    'medication',
    'occurenceDateTime',
    'status'
  ];
 
patients:any[]=[];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

  constructor(private fhirService: ApiService,public dialog: MatDialog) {}

  onStatusButtonClick(element: any) {
    if (element.status === 'stopped') {
      this.openDialog(element.isSubPotent);
    }
  }

  openDialog(isSubPotent: boolean) {
    this.dialog.open(DialogDataExampleDialog, {
      data: { isSubPotent }
    });
  }

      
  ngOnInit(): void {
    console.log('Component initialized, calling getMedicationRequests()');
    this.getMedicationRequests();
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

 
  getMedicationRequests(): void {
    this.fhirService.getMedicationadministration().subscribe(
      (data: any) => {
        console.log(typeof data[0])
        // this.dataSource.data = data;
      for(let i=0;i<data.length;i++){
        let idPatient=data[i].subject.reference.substring(8, data[i].subject.reference.length);
        console.log(idPatient);
        this.fhirService.getPatient(idPatient).subscribe(
          (data1: any) => {
            // this.patients.push(data.name[0].family+" "+data.name[0].given)
            this.patients.push({
                "subject":data1.name[0].family+" "+data1.name[0].given,
                "medication":"test",
                "occurenceDateTime":data[i].occurenceDateTime,
                "status":data[i].status
            })
        }
      ).add(()=>{
        this.patients[i].medication="essai";

        this.dataSource.data = this.patients;
      })

      // service de medicament
    }
      },
      (error) => {
        console.error('Error fetching Medication Requests:', error);
      }
    );
  }
  
  
}

