import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		data: {
			title: 'Vehicles'
		},
		children: [
			{
				path: 'vehicle',
				loadChildren: 'app/modules/setup/vehicle/vehicle.module#VehicleModule'
			},
			{
				path: 'city',
				loadChildren: 'app/modules/setup/city/city.module#CityModule'
			},
			{
				path: 'state',
				loadChildren: 'app/modules/setup/state/state.module#StateModule'
			},
			{
				path: 'branch',
				loadChildren: 'app/modules/setup/branch/branch.module#BranchModule'
			},
			{
				path: 'driver',
				loadChildren: 'app/modules/setup/driver/driver.module#DriverModule'
			},
			{
				path: 'company',
				loadChildren: 'app/modules/setup/company/company.module#CompanyModule'
			},
			{
				path: 'vehicle-company',
				loadChildren: 'app/modules/setup/vehicle.company/vehicle.company.module#VehicleCompanyModule'
			},
			{
				path: 'vehicle-model',
				loadChildren: 'app/modules/setup/vehicle.model/vehicle.model.module#VehicleModelModule'
			},
			{
				path: 'vehicle-km',
				loadChildren: 'app/modules/setup/vehicle.km/vehicle.km.module#VehicleKmModule'
			},

			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'vehicle',
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SetupRoutingModule {}
