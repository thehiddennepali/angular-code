import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';

import { DriverIndexComponent } from './driver.index.component';
import { DriverFormComponent } from './driver.form.component';
import { DriverRoutingModule } from './driver.routing.module';

import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		DriverRoutingModule,
		DatepickerModule.forRoot(),
		BsDatepickerModule.forRoot(),
	],
	declarations: [
		DriverIndexComponent,
		DriverFormComponent,
	]
})
export class DriverModule { }
