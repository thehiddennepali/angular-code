import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { GlobalService } from '../../../services/global.service';
import { City } from '../../../classes/city';
import { CityService } from '../../../services/city.service';
import { Vehicle } from '../../../classes/vehicle';
import { VehicleService } from '../../../services/vehicle.service';
import { VehicleCompany } from '../../../classes/vehicle.company';
import { VehicleCompanyService } from '../../../services/vehicle.company.service';
import { VehicleModel } from '../../../classes/vehicle.model';
import { VehicleModelService } from '../../../services/vehicle.model.service';


import * as moment from 'moment';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-vehicle',
	templateUrl: './vehicle.form.component.html',
	styleUrls: ['./vehicle.form.component.scss']
})
export class VehicleFormComponent implements OnInit, OnDestroy {

	public _mode: string = '';
	public _id: number;
	public _parameters: any;
	public _model: Vehicle;
	public _errorMessage: string;
	public _successMessage: string;
	public _form: FormGroup;
	public _formErrors: any;
	public _submitted: boolean = false;
	public _cities: City[];
	public _v_companies: VehicleCompany[];
	public _v_services: VehicleModel[];

	public datepickerConfig: Partial<BsDatepickerConfig>;

	public registration_date: Date;
	public invoice_date: Date;
	public sale_date: Date;

	@ViewChild('vehiclePicFileInput') vehiclePicFileInput: ElementRef;
	@ViewChild('chasisPicFileInput') chasisPicFileInput: ElementRef;
	@ViewChild('rcFileInput') rcFileInput: ElementRef;
	@ViewChild('ownerPanCardFileInput') ownerPanCardFileInput: ElementRef;
	@ViewChild('tdsDeclarationFileInput') tdsDeclarationFileInput: ElementRef;

	constructor(
		private _global: GlobalService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _formBuilder: FormBuilder,
		private _cityService: CityService,
		private _vehicleService: VehicleService,
		private _vehicleCompanyService: VehicleCompanyService,
		private _vehicleModelService: VehicleModelService
	) {

		// Construct form group
		this._form = _formBuilder.group({
			v_no: ['', Validators.compose([
				Validators.required,
				Validators.minLength(5),
				Validators.maxLength(50)
			])],
			vehicle_company_id: ['', Validators.compose([
				Validators.required
			])],
			vehicle_model_id: ['', Validators.compose([
				Validators.required
			])],
			owner_name: ['', Validators.compose([
				Validators.required,
				Validators.minLength(5),
				Validators.maxLength(100)
			])],
			owner_address: ['', Validators.compose([
				Validators.required,
				Validators.minLength(5),
				Validators.maxLength(100)
			])],
			owner_pan_no: ['', Validators.compose([
				Validators.required
			])],
			ime_no: ['', Validators.compose([
				Validators.required
			])],
			gps_key: ['', Validators.compose([
				Validators.required
			])],
			gps_url: ['', Validators.compose([
				Validators.required
			])],

			make_name: ['', Validators.compose([])],
			avg_mileage: ['', Validators.compose([])],
			no_of_tyres: ['', Validators.compose([])],
			chasis_no: ['', Validators.compose([])],
			engine_no: ['', Validators.compose([])],
			manufature_year: ['', Validators.compose([])],
			registration_date: ['', Validators.compose([])],
			km_reading: ['', Validators.compose([])],
			d_tank_capacity: ['', Validators.compose([])],
			rlwl: ['', Validators.compose([])],
			company_mileage: ['', Validators.compose([])],
			tare_weight: ['', Validators.compose([])],

			purchase_from: ['', Validators.compose([])],
			dealer_address: ['', Validators.compose([])],
			dealer_city: ['', Validators.compose([])],
			after_sales_service_provided_by: ['', Validators.compose([])],
			invoice_no: ['', Validators.compose([])],
			invoice_date: ['', Validators.compose([])],
			asset_cost: ['', Validators.compose([])],
			free_services_provided: ['', Validators.compose([])],
			no_of_free_services: ['', Validators.compose([])],
			duplicate_key_at_ho: ['', Validators.compose([])],

			chasis_serial_no: ['', Validators.compose([])],
			accessories_supplied: ['', Validators.compose([])],
			body_height: ['', Validators.compose([])],
			chasis_length: ['', Validators.compose([])],
			chasis_color: ['', Validators.compose([])],
			body_color: ['', Validators.compose([])],


			engine_serial_no: ['', Validators.compose([])],
			engine_power: ['', Validators.compose([])],
			ignition_key_no: ['', Validators.compose([])],
			fuel_type: ['', Validators.compose([])],
			door_key: ['', Validators.compose([])],
			engine_color: ['', Validators.compose([])],
			cylinders: ['', Validators.compose([])],
			engine_interior_color: ['', Validators.compose([])],
			torque: ['', Validators.compose([])],

			sale_date: ['', Validators.compose([])],
			sale_price: ['', Validators.compose([])],
			buyer_company: ['', Validators.compose([])],
			sold_to: ['', Validators.compose([])],
			buyer_address: ['', Validators.compose([])],
			buyer_city: ['', Validators.compose([])],
			buyer_phone: ['', Validators.compose([])],
			meter_reading_at_sale: ['', Validators.compose([])],
			sale_comments: ['', Validators.compose([])],

			vehicle_pic: ['', Validators.compose([])],
			chasis_pic: ['', Validators.compose([])],
			rc: ['', Validators.compose([])],
			owner_pan_card: ['', Validators.compose([])],
			tds_declaration: ['', Validators.compose([])],

			media_vehicle_pic : ['', Validators.compose([])],
			media_chasis_pic : ['', Validators.compose([])],
			media_rc : ['', Validators.compose([])],
			media_owner_pan_card : ['', Validators.compose([])],
			media_tds_declaration : ['', Validators.compose([])]
		});

		this._form.valueChanges.subscribe(data => this.onValueChanged(data));
		this.datepickerConfig = Object.assign({}, {
			showWeekNumbers: false,
			containerClass: 'theme-dark-blue',
			dateInputFormat: environment.dateFormat
		});
	}

	get v_no() { return this._form.get('v_no'); }
	get owner_name() { return this._form.get('owner_name'); }
	get owner_address() { return this._form.get('owner_address'); }

	public _isValid(field): boolean {
		let isValid: boolean = false;

		// If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
		if (this._form.controls[field].touched === false) {
			isValid = true;
		} else if (this._form.controls[field].touched === true && this._form.controls[field].valid === true) {
			// If the field is touched and valid value, then it is considered as valid.
			isValid = true;
		}

		return isValid;
	}

	public onValueChanged(data?: any) {
		if (!this._form) { return; }
		const form = this._form;
		for (const field of Object.keys(this._formErrors)) {
			// clear previous error message (if any)
			const control = form.get(field);
			if (control && control.dirty) {
				this._formErrors[field].valid = true;
				this._formErrors[field].message = '';
			}
		}
	}

	public ngOnInit() {
		this._resetFormErrors();
		this._resetModel();

		// _route is activated route service. this._route.params is observable.
		// subscribe is method that takes function to retrieve parameters when it is changed.
		this._parameters = this._activatedRoute.params.subscribe(params => {
			// plus(+) is to convert 'id' to number
			if (typeof params['Id'] !== 'undefined') {

				this._id = Number.parseInt(params['Id']);
				this._errorMessage = '';
				this._successMessage = '';
				this._vehicleService.get(this._id)
				.subscribe(
					models => {
						this._model = models;
						this._mode = 'update';

						this.registration_date = new Date(this._model.registration_date);
						this.invoice_date = new Date(this._model.invoice_date);
						this.sale_date = new Date(this._model.sale_date);
					},
					error => {
						// unauthorized access
						if (error.status === 401 || error.status === 403) {
							this._global.unauthorizedAccess(error);
						} else {
							this._errorMessage = error.data.message;
						}
					}
				);
			} else {
				this._mode = 'create';

			}
		});
		this.getCities();
		this.getCompanies();
		this.getModels();
	}

	public ngOnDestroy() {
		this._parameters.unsubscribe();
		this._model = new Vehicle();
	}

	public onSubmit() {

		const formModel = this._form.value;

		if (this._form.value.media_vehicle_pic !== '') {
			this._model.media_vehicle_pic = this._form.value.media_vehicle_pic;
		}

		if (this._form.value.media_chasis_pic !== '') {
			this._model.media_chasis_pic = this._form.value.media_chasis_pic;
		}

		if (this._form.value.media_rc !== '') {
			this._model.media_rc = this._form.value.media_rc;
		}

		if (this._form.value.media_owner_pan_card !== '') {
			this._model.media_owner_pan_card = this._form.value.media_owner_pan_card;
		}

		if (this._form.value.media_tds_declaration !== '') {
			this._model.media_tds_declaration = this._form.value.media_tds_declaration;
		}

		this._submitted = true;
		this._resetFormErrors();
		if (this._mode === 'create') {
			this._vehicleService.add(this._model).subscribe(
				response => {
					if (response.success) {
						// this._router.navigate(['/vehicle']);
						this._errorMessage = '';
						this._successMessage = response.data.v_no + ' vehicle created successsfully!';
						this._submitted = false;
						this._resetModel();
					} else {
						this._submitted = false;
					}
				},
				error => {
					this._submitted = false;
					// Validation errors
					if (error.status === 422) {
						this._setFormErrors(error.data);
					} else if (error.status === 401 || error.status === 403) {
						// Unauthorized Access
						this._global.unauthorizedAccess(error);
					} else {
						// All other errors
						this._errorMessage = error.data.message;
					}
				}
			);
		} else if (this._mode ===  'update') {
			this._vehicleService.update(this._model).subscribe(
				response => {
					if (response.success) {
						// this._router.navigate(['/vehicle']);
						this._errorMessage = '';
						this._successMessage = response.data.v_no + ' vehicle updated successfully!';
						this._submitted = false;
					} else {
						this._submitted = false;
					}
				},
				error => {
					this._submitted = false;
					// Validation errors
					if (error.status === 422) {
						this._setFormErrors(error.data);
					} else if (error.status === 401 || error.status === 403) {
						// Unauthorized Access
						this._global.unauthorizedAccess(error);
					} else {
						// All other errors
						this._errorMessage = error.data.message;
					}
				}
			);
		}
	}

	public getCities() {
		this._cities = null;
		this._cityService.getAll().subscribe(
			models => {
				this._cities = models;
			},
			error =>  {
				// unauthorized access
				if (error.status === 401 || error.status === 403) {
					this._global.unauthorizedAccess(error);
				} else {
					this._errorMessage = error.data.message;
				}
			}
		);
	}

	public getCompanies() {
		this._v_companies = null;
		this._vehicleCompanyService.getAll().subscribe(
			models => {
				this._v_companies = models;
			},
			error =>  {
				// unauthorized access
				if (error.status === 401 || error.status === 403) {
					this._global.unauthorizedAccess(error);
				} else {
					this._errorMessage = error.data.message;
				}
			}
		);
	}

	public getModels() {
		this._v_services = null;
		this._vehicleModelService.getAll().subscribe(
			models => {
				this._v_services = models;
			},
			error =>  {
				// unauthorized access
				if (error.status === 401 || error.status === 403) {
					this._global.unauthorizedAccess(error);
				} else {
					this._errorMessage = error.data.message;
				}
			}
		);
	}

	public onUpdate(scenario: any) {
		this._vehicleService.updateDetails(this._model, scenario).subscribe(
			response => {
				if (response.success) {
					this._router.navigate(['/vehicle']);
				} else {
					this._submitted = false;
				}
			},
			error => {
				this._submitted = false;
				// Validation errors
				if (error.status === 422) {
					this._setFormErrors(error.data);
				} else if (error.status === 401 || error.status === 403) {
					// Unauthorized Access
					this._global.unauthorizedAccess(error);
				} else {
					// All other errors
					this._errorMessage = error.data.message;
				}
			}
		);
	}

	onCompanyChange(event) {
		const company_id = event.target.value;

		this._v_services = null;
		this._vehicleModelService.getByCompany(company_id).subscribe(
			models => {
				this._v_services = models;
				this._model.vehicle_model_id = null;

			},
			error =>  {
				// unauthorized access
				if (error.status === 401 || error.status === 403) {
					this._global.unauthorizedAccess(error);
				} else {
					this._errorMessage = error.data.message;
				}
			}
		);
	}

	onFileChange(event) {
		const reader = new FileReader();
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			reader.readAsDataURL(file);
			reader.onload = () => {
				this._form.get(event.target.id).setValue({
					filename: file.name,
					filetype: file.type,
					value: reader.result.split(',')[1]
				});
			};
		}
	}

	clearVehicleFile() {
		this._form.get('media_vehicle_pic').setValue(null);
		this.vehiclePicFileInput.nativeElement.value = '';
	}

	clearChasisFile() {
		this._form.get('media_chasis_pic').setValue(null);
		this.chasisPicFileInput.nativeElement.value = '';
	}

	clearRcFile() {
		this._form.get('media_rc').setValue(null);
		this.rcFileInput.nativeElement.value = '';
	}

	clearOwnerPanCardFile() {
		this._form.get('media_owner_pan_card').setValue(null);
		this.rcFileInput.nativeElement.value = '';
	}

	clearTdsDeclarationFile() {
		this._form.get('media_tds_declaration').setValue(null);
		this.rcFileInput.nativeElement.value = '';
	}

	public onChangeDate(type: string, dateTime: string) {
		let formattedDateTime: string = null;
		if (moment(dateTime).isValid()) {
			formattedDateTime = moment(dateTime).format('YYYY-MM-DD');
		}

		if (type === 'registration_date') {
			this._model.registration_date = formattedDateTime;
		}

		if (type === 'invoice_date') {
			this._model.invoice_date = formattedDateTime;
		}

		if (type === 'sale_date') {
			this._model.sale_date = formattedDateTime;
		}
	}

	public hideSuccessMessage() {
		this._successMessage = '';
	}

	public hideErrorMessage() {
		this._errorMessage = '';
	}

	private _setFormErrors(errorFields: any): void {
		for (const i of Object.keys(errorFields)) {
			const key = errorFields[i];

			// skip loop if the property is from prototype
			if (!this._formErrors.hasOwnProperty(key.field)) {
				continue;
			}

			this._formErrors[key.field].valid = false;
			this._formErrors[key.field].message = key.message;
		}
	}

	private _resetFormErrors(): void {
		this._formErrors = {
			v_no: {valid: true, message: ''},
			vehicle_company_id: {valid: true, message: ''},
			vehicle_model_id: {valid: true, message: ''},
			owner_name: {valid: true, message: ''},
			owner_address: {valid: true, message: ''},
			owner_pan_no: {valid: true, message: ''},
			ime_no: {valid: true, message: ''},
			gps_key: {valid: true, message: ''},
			gps_url: {valid: true, message: ''},

			make_name : {valid: true, message: ''},
			avg_mileage : {valid: true, message: ''},
			no_of_tyres : {valid: true, message: ''},
			chasis_no : {valid: true, message: ''},
			engine_no : {valid: true, message: ''},
			manufature_year : {valid: true, message: ''},
			registration_date : {valid: true, message: ''},
			km_reading : {valid: true, message: ''},
			d_tank_capacity : {valid: true, message: ''},
			rlwl : {valid: true, message : ''},
			company_mileage : {valid: true, message : ''},
			tare_weight : {valid: true, message : ''},

			purchase_from : {valid: true, message : ''},
			dealer_address : {valid: true, message : ''},
			dealer_city : {valid: true, message : ''},
			after_sales_service_provided_by : {valid: true, message: ''},
			invoice_no : {valid: true, message: ''},
			invoice_date : {valid: true, message: ''},
			asset_cost : {valid: true, message: ''},
			free_services_provided : {valid: true, message: ''},
			no_of_free_services : {valid: true, message: ''},
			duplicate_key_at_ho : {valid: true, message: ''},

			chasis_serial_no : {valid: true, message: ''},
			accessories_supplied : {valid: true, message: ''},
			body_height : {valid: true, message: ''},
			chasis_length : {valid: true, message: ''},
			chasis_color : {valid: true, message: ''},
			body_color : {valid: true, message: ''},

			engine_serial_no : {valid: true, message: ''},
			engine_power : {valid: true, message: ''},
			ignition_key_no : {valid: true, message: ''},
			fuel_type : {valid: true, message: ''},
			door_key : {valid: true, message: ''},
			engine_color : {valid: true, message: ''},
			cylinders : {valid: true, message: ''},
			engine_interior_color : {valid: true, message: ''},
			torque : {valid: true, message: ''},

			sale_date : {valid: true, message: ''},
			sale_price : {valid: true, message: ''},
			buyer_company : {valid: true, message: ''},
			sold_to : {valid: true, message: ''},
			buyer_address : {valid: true, message: ''},
			buyer_city : {valid: true, message: ''},
			buyer_phone : {valid: true, message: ''},
			meter_reading_at_sale : {valid: true, message: ''},
			sale_comments : {valid: true, message: ''},

			vehicle_pic : {valid: true, message: ''},
			chasis_pic : {valid: true, message: ''},
			rc : {valid: true, message: ''},
			owner_pan_card : {valid: true, message: ''},
			tds_declaration : {valid: true, message: ''},

			media_vehicle_pic : {valid: true, message: ''},
			media_chasis_pic : {valid: true, message: ''},
			media_rc : {valid: true, message: ''},
			media_owner_pan_card : {valid: true, message: ''},
			media_tds_declaration : {valid: true, message: ''},

		};
	}

	private _resetModel() {
		this._model = new Vehicle();
		this._model.v_no = null;
		this._model.vehicle_company_id = null;
		this._model.vehicle_model_id = null;
		this._model.owner_name = null;
		this._model.owner_address = null;
		this._model.owner_pan_no = null;
		this._model.ime_no = null;
		this._model.gms_key = null;
		this._model.gps_url = null;

		// registration part
		this._model.make_name = null;
		this._model.avg_mileage = null;
		this._model.no_of_tyres = null;
		this._model.chasis_no = null;
		this._model.engine_no = null;
		this._model.manufature_year = null;
		this._model.registration_date = null;
		this._model.km_reading = null;
		this._model.d_tank_capacity = null;
		this._model.rlwl = null;
		this._model.company_mileage = null;
		this._model.tare_weight = null;

		// purchase tab
		this._model.purchase_from = null;
		this._model.dealer_address = null;
		this._model.dealer_city = null;
		this._model.after_sales_service_provided_by = null;
		this._model.invoice_no = null;
		this._model.invoice_date = null;
		this._model.asset_cost = null;
		this._model.free_services_provided = null;
		this._model.no_of_free_services = null;
		this._model.duplicate_key_at_ho = null;

		// chassis tab
		this._model.chasis_serial_no = null;
		this._model.accessories_supplied = null;
		this._model.body_height	= null;
		this._model.chasis_length	= null;
		this._model.chasis_color = null;
		this._model.body_color = null;

		// engine tab
		this._model.engine_serial_no = null;
		this._model.engine_power = null;
		this._model.ignition_key_no = null;
		this._model.fuel_type = null;
		this._model.door_key = null;
		this._model.engine_color = null;
		this._model.cylinders = null;
		this._model.engine_interior_color = null;
		this._model.torque = null;

		// sale tab
		this._model.sale_date =   null;
		this._model.sale_price    =   null;
		this._model.buyer_company =   null;
		this._model.sold_to   =   null;
		this._model.buyer_address =   null;
		this._model.buyer_city    =   null;
		this._model.buyer_phone   =   null;
		this._model.meter_reading_at_sale =   null;
		this._model.sale_comments =   null;

		// documents tab
		this._model.vehicle_pic   = null;
		this._model.chasis_pic    = null;
		this._model.rc            = null;
		this._model.owner_pan_card = null;
		this._model.tds_declaration = null;

		// temporary variables
		this._model.media_vehicle_pic = null;
		this._model.media_chasis_pic = null;
		this._model.media_rc = null;
		this._model.media_owner_pan_card = null;
		this._model.media_tds_declaration = null;
	}
}
