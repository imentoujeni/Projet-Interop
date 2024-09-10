
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private fhirApiUrl = 'https://fhir.alliance4u.io/api';

  constructor(private http: HttpClient) {}

  createMedicationRequest(medicationRequest: any): Observable<any> {
    console.log(medicationRequest);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.fhirApiUrl+'/Medication-request', medicationRequest, { headers });
  }

  

  getMedicationadministration(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
     
    });

    return this.http.get(this.fhirApiUrl+'/Medication-administration', { headers });
  }



}






 
