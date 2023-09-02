import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeycloakPlaygroundComponent } from './keycloak-playground.component';

describe('KeycloakPlaygroundComponent', () => {
  let component: KeycloakPlaygroundComponent;
  let fixture: ComponentFixture<KeycloakPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeycloakPlaygroundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeycloakPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
