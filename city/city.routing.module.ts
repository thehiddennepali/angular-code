import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CityIndexComponent } from './city.index.component';
import { CityFormComponent } from './city.form.component';

const routes: Routes = [
	{
		path: '',
		data: {
			title: 'Manage Cities'
		},
		children: [
			{
				path: 'index',
				component: CityIndexComponent,
				data: {
					title: 'Manage Cities',
				}
			},
			{
				path: 'create',
				component: CityFormComponent,
				data: {
					title: 'Add City'
				}
			},
			{
				path: ':Id',
				component: CityFormComponent,
				data: {
					title: 'Update City'
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
export class CityRoutingModule {}
