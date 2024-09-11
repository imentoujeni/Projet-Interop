import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListepaiementComponent } from './listepaiement.component';

describe('ListepaiementComponent', () => {
  let component: ListepaiementComponent;
  let fixture: ComponentFixture<ListepaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListepaiementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListepaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
