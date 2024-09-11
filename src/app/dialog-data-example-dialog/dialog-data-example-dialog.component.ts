import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-data-example-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent,CommonModule],
  templateUrl: './dialog-data-example-dialog.component.html',
  styleUrl: './dialog-data-example-dialog.component.scss'
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data:any) {

  }


}
export class DialogDataExampleDialogComponent {

}
