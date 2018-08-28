import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';

import { VehicleIndexComponent } from './vehicle.index.component';
import { VehicleFormComponent } from './vehicle.form.component';
import { VehicleRoutingModule } from './vehicle.routing.module';

import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		VehicleRoutingModule,
		DatepickerModule.forRoot(),
		BsDatepickerModule.forRoot(),
	],
	declarations: [
		VehicleIndexComponent,
		VehicleFormComponent,
	]
})
export class VehicleModule { }
