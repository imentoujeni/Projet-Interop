import { Component, Inject, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogDataExampleDialog } from '../dialog-data-example-dialog/dialog-data-example-dialog.component';

@Component({
  selector: 'app-notice',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatButtonModule],
  templateUrl: './notice.component.html',
  styleUrl: './notice.component.scss',
})
export class NoticeComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'recipient',
    'status',
    'created',
    'amount'
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

  constructor(private fhirService: ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getNotice();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getNotice(): void {
    // Call the ApiService to get the notice data
    this.fhirService.getNotice().subscribe(
      (data: any[]) => {
        for (let i = 0; i < data.length; i++) {
        console.log(data)
        this.dataSource.data = data;  }
      },
      (error) => {
        console.error('Error fetching notices:', error);
      }
    );
   
  }

  onStatusButtonClick(element: any) {
    if (element.status === 'stopped') {
      this.openDialog(element.isSubPotent);
    }
  }

  openDialog(isSubPotent: boolean) {
    this.dialog.open(DialogDataExampleDialog, {
      data: { isSubPotent },
    });
  }
}
