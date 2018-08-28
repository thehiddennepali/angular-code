import { NgModule } from '@angular/core';
import { SetupRoutingModule} from './setup.routing.module';

import { BranchService } from '../../services/branch.service';
import { CityService } from '../../services/city.service';
import { CompanyService } from '../../services/company.service';
import { StateService } from '../../services/state.service';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleCompanyService } from '../../services/vehicle.company.service';
import { VehicleModelService } from '../../services/vehicle.model.service';
import { VehicleKmService } from '../../services/vehicle.km.service';
import { DriverService } from '../../services/driver.service';


@NgModule({
	imports: [
		SetupRoutingModule
	],
	declarations: [],
	providers: [
		BranchService,
		CityService,
		CompanyService,
		StateService,
		VehicleService,
		VehicleCompanyService,
		VehicleModelService,
		VehicleKmService,
		DriverService
	]
})
export class SetupModule { }
