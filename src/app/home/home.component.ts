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
  selector: 'app-home',
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
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  isEditable = false;
  todayDate: string = '';

  // Liste des médicaments avec leurs codes SNOMED
  readonly allowedSnomedCodes = [
    { code: '13525006', nom: "Acetylcholine" },
    { code: '18381001', nom: "Pindolol" },
    { code: '19194001', nom: "Didanosine" }
  ];
  // Liste des médecins
  readonly allowedMedecins = [
    { code: '66dffe7399cb8a001240f331', nom: "Manhattan maboul" }
  ];
  
  constructor(private _formBuilder: FormBuilder, private fhirService: ApiService) {}

  ngOnInit(): void {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];

    this.firstFormGroup = this._formBuilder.group({
      'requester.display': ['66dffe7399cb8a001240f331', Validators.required],
      status: ['', Validators.required],
      'subject.display': ['', Validators.required],
      intent: ['', Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      'medication.concept.coding.display': ['', Validators.required], // Stocke le code SNOMED
      validityPeriod: ['', Validators.required],
      authoredOn: ['', Validators.required],
      quantity: ['', Validators.required],
      'dosageInstruction.text': ['', Validators.required],
      'substitution.allowedBoolean': ['', Validators.required],
     
    });
  }

  submitMedicationRequest(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      let medicationRequest = {
        requester: {
          display: this.firstFormGroup.value['requester.display'],
        },
        resourceType: 'MedicationRequest',
        status: this.firstFormGroup.value.status,
        intent: this.firstFormGroup.value.intent,
        subject: {
          display: this.firstFormGroup.value['subject.display'],
        },
        medication: {
          concept: {
            coding: [{
              display: this.getMedicationName(this.secondFormGroup.value['medication.concept.coding.display']),
              code: this.secondFormGroup.value['medication.concept.coding.display'],
            }],
          },
        },
        validityPeriod: this.secondFormGroup.value.validityPeriod,
        quantity: this.secondFormGroup.value.quantity,
        dosageInstruction: [{
          text: this.secondFormGroup.value['dosageInstruction.text'],
        }],
        substitution: [{
          allowedBoolean: this.secondFormGroup.value['substitution.allowedBoolean'],
        }],
        authoredOn: this.secondFormGroup.value.authoredOn,
      };
    
      this.fhirService.createMedicationRequest(medicationRequest).subscribe(response => {
        console.log('MedicationRequest submitted successfully:', response);
      }, error => {
        console.error('Error submitting MedicationRequest:', error);
      });
    }
  }

  // Fonction pour obtenir le nom du médicament à partir du code
  getMedicationName(code: string): string {
    const med = this.allowedSnomedCodes.find(med => med.code === code);
    return med ? med.nom : '';
  }
}