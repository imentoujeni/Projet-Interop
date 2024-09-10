

import { Component, OnInit } from '@angular/core';
import {AfterViewInit,ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'subject', 
    'medication', 
    'status', 
    'occurenceDateTime', 
    'isSubPotent', 
    'subPotentReason'
  
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

  constructor(private fhirService: ApiService) {}

  ngOnInit(): void {
    this.getMedicationRequests(); // Fetch data when component is initialized
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getMedicationRequests(): void {
    this.fhirService.getMedicationadministration().subscribe(
      (data: any) => {
        if (data && data.entry) {
          // Check if 'data.entry' is defined before mapping
          this.dataSource.data = data.entry.map((entry: any) => entry.resource);
        } else {
          console.warn('No entries found in response:', data);
          this.dataSource.data = []; // Ensure dataSource is set to an empty array if no data
        }
      },
      (error) => {
        console.error('Error fetching Medication Requests:', error);
      }
    );
  }
}