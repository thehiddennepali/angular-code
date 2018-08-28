import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';

import { CityIndexComponent } from './city.index.component';
import { CityFormComponent } from './city.form.component';
import { CityRoutingModule } from './city.routing.module';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CityRoutingModule,
	],
	declarations: [
		CityIndexComponent,
		CityFormComponent,
	]
})
export class CityModule { }
