import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';

import { StateIndexComponent } from './state.index.component';
import { StateFormComponent } from './state.form.component';
import { StateRoutingModule } from './state.routing.module';
import { DataTableModule } from 'angular2-datatable';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		StateRoutingModule,
		DataTableModule
	],
	declarations: [
		StateIndexComponent,
		StateFormComponent,
	]
})
export class StateModule { }
