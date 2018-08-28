import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverIndexComponent } from './driver.index.component';
import { DriverFormComponent } from './driver.form.component';

const routes: Routes = [
	{
		path: '',
		data: {
			title: 'Manage Drivers'
		},
		children: [
			{
				path: 'index',
				component: DriverIndexComponent,
				data: {
					title: 'Manage Drivers',
				}
			},
			{
				path: 'create',
				component: DriverFormComponent,
				data: {
					title: 'Add Driver'
				}
			},
			{
				path: ':Id',
				component: DriverFormComponent,
				data: {
					title: 'Update Driver'
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
export class DriverRoutingModule {}
