import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchIndexComponent } from './branch.index.component';

describe('BranchIndexComponent', () => {
	let component: BranchIndexComponent;
	let fixture: ComponentFixture<BranchIndexComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ BranchIndexComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BranchIndexComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
