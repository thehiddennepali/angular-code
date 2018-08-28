import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleIndexComponent } from './vehicle.index.component';
import { VehicleFormComponent } from './vehicle.form.component';

const routes: Routes = [
	{
		path: '',
		data: {
			title: 'Manage Vehicles'
		},
		children: [
			{
				path: 'index',
				component: VehicleIndexComponent,
				data: {
					title: 'Manage Vehicles',
				}
			},
			{
				path: 'create',
				component: VehicleFormComponent,
				data: {
					title: 'Add Vehicle'
				}
			},
			{
				path: ':Id',
				component: VehicleFormComponent,
				data: {
					title: 'Update Vehicle'
				}
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'index'
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class VehicleRoutingModule {}
