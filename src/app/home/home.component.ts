
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [

    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  isEditable = false;

  constructor(private _formBuilder: FormBuilder, private fhirService: ApiService) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      status: ['', Validators.required],
      'subject.display': ['', Validators.required],
      intent: ['', Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      'medication.concept.coding.display': ['', Validators.required],
      validityPeriod: ['', Validators.required],
      quantity: ['', Validators.required],
      'dosageInstruction.text': ['', Validators.required],
      'substitution.allowedBoolean': ['', Validators.required],
    });
  }

  // This method will be triggered when you want to send the request to the FHIR API
  submitMedicationRequest(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {

      let medicationRequest = {
        resourceType: 'MedicationRequest',
        status: this.firstFormGroup.value.status,
        intent: this.firstFormGroup.value.intent,
        subject: {
          display: this.firstFormGroup.value['subject.display'],
        },
        medication: {
          concept: {
            coding: [{
              display: this.secondFormGroup.value['medication.concept.coding.display'],
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
        }]
      };

      this.fhirService.createMedicationRequest(medicationRequest).subscribe(response => {
        console.log('MedicationRequest submitted successfully:', response);
      }, error => {
        console.error('Error submitting MedicationRequest:', error);
      });
    }
  }
}
