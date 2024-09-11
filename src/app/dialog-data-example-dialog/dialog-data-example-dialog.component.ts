import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { DialogData } from '../notification/notification.component';

@Component({
  selector: 'app-dialog-data-example-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './dialog-data-example-dialog.component.html',
  styleUrl: './dialog-data-example-dialog.component.scss'
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { isSubPotent: boolean}) {

    console.log(data.isSubPotent)
  }

}
export class DialogDataExampleDialogComponent {

}
