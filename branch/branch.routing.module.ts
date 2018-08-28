import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BranchIndexComponent } from './branch.index.component';
import { BranchFormComponent } from './branch.form.component';

const routes: Routes = [
	{
		path: '',
		data: {
			title: 'Manage Branches'
		},
		children: [
			{
				path: 'index',
				component: BranchIndexComponent,
				data: {
					title: 'Manage Branches',
				}
			},
			{
				path: 'create',
				component: BranchFormComponent,
				data: {
					title: 'Add Branch'
				}
			},
			{
				path: ':Id',
				component: BranchFormComponent,
				data: {
					title: 'Update Branch'
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
export class BranchRoutingModule {}
