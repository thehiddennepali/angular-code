import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StateIndexComponent } from './state.index.component';
import { StateFormComponent } from './state.form.component';

const routes: Routes = [
	{
		path: '',
		data: {
			title: 'Manage States'
		},
		children: [
			{
				path: 'index',
				component: StateIndexComponent,
				data: {
					title: 'Manage States',
				}
			},
			{
				path: 'create',
				component: StateFormComponent,
				data: {
					title: 'Add State'
				}
			},
			{
				path: ':Id',
				component: StateFormComponent,
				data: {
					title: 'Update State'
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
export class StateRoutingModule {}
