
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.scss'
})


export class PaiementComponent implements OnInit {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  isEditable = false;
  todayDate: string = '';

  // Liste des médicaments avec leurs codes SNOMED

  constructor(private _formBuilder: FormBuilder, private fhirService: ApiService) {}

  ngOnInit(): void {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];

    this.firstFormGroup = this._formBuilder.group({
      status: ['', Validators.required],
      type: ['', Validators.required],
      use: ['', Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      reference: ['', Validators.required], // Stocke le code SNOMED
      created: ['', Validators.required],
      unitPrice: [Validators.required],
     
    });
  }

  submitclaim(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      let claim = {
        resourceType: 'Claim',
        status: this.firstFormGroup.value.status,
        type: this.firstFormGroup.value.type,
        use: this.firstFormGroup.value.use,
        patient: {
          reference: this.secondFormGroup.value.reference,
        },
      
        created: this.secondFormGroup.value.created,
        item: [{
          unitPrice: {
            value : Number(this.secondFormGroup.value.unitPrice)
          },
        }],
      };

      this.fhirService.createClaim(claim).subscribe(response => {
        console.log('claim submitted successfully:', response);
      }, error => {
        console.error('Error submitting claim:', error);
      });
    }
  }

  // Fonction pour obtenir le nom du médicament à partir du code
 
}