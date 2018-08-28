import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';

import { BranchIndexComponent } from './branch.index.component';
import { BranchFormComponent } from './branch.form.component';
import { BranchRoutingModule } from './branch.routing.module';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		BranchRoutingModule,
	],
	declarations: [
		BranchIndexComponent,
		BranchFormComponent,
	]
})
export class BranchModule { }
