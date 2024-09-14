import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceSelectionComponent } from './piece-selection.component';

describe('PieceSelectionComponent', () => {
  let component: PieceSelectionComponent;
  let fixture: ComponentFixture<PieceSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieceSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieceSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
