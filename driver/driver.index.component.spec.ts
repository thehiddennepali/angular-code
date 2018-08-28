import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverIndexComponent } from './driver.index.component';

describe('DriverIndexComponent', () => {
	let component: DriverIndexComponent;
	let fixture: ComponentFixture<DriverIndexComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ DriverIndexComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DriverIndexComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
