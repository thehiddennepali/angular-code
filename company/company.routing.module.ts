import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyIndexComponent } from './company.index.component';
import { CompanyFormComponent } from './company.form.component';

const routes: Routes = [
	{
		path: '',
		data: {
			title: 'Manage Companies'
		},
		children: [
			{
				path: 'index',
				component: CompanyIndexComponent,
				data: {
					title: 'Manage Companies',
				}
			},
			{
				path: 'create',
				component: CompanyFormComponent,
				data: {
					title: 'Add Company'
				}
			},
			{
				path: ':Id',
				component: CompanyFormComponent,
				data: {
					title: 'Update Company'
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
export class CompanyRoutingModule {}
