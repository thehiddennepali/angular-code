import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';

import { CompanyIndexComponent } from './company.index.component';
import { CompanyFormComponent } from './company.form.component';
import { CompanyRoutingModule } from './company.routing.module';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CompanyRoutingModule,
	],
	declarations: [
		CompanyIndexComponent,
		CompanyFormComponent,
	]
})
export class CompanyModule { }
