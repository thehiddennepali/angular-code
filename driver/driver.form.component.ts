import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { DriverService } from '../../../services/driver.service';
import { CompanyService } from '../../../services/company.service';
import { CityService } from '../../../services/city.service';
import { StateService } from '../../../services/state.service';
import { Driver } from '../../../classes/driver';
import { Company } from '../../../classes/company';
import { City } from '../../../classes/city';
import { State } from '../../../classes/state';
import { GlobalService } from '../../../services/global.service';

import * as moment from 'moment';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-driver',
	templateUrl: './driver.form.component.html',
	styleUrls: ['./driver.form.component.scss']
})
export class DriverFormComponent implements OnInit, OnDestroy {

	public _mode: string = '';
	public _id: number;
	public _parameters: any;
	public _model: Driver;
	public _companies: Company[];
	public _cities: City[];
	public _states: State[];
	public _errorMessage: string;
	public _successMessage: string;
	public _form: FormGroup;
	public _formErrors: any;
	public _submitted: boolean = false;
	public _loading: boolean = true;
	public _bloodGroups: any = {};

	public datepickerConfig: Partial<BsDatepickerConfig>;

	public joining_date: Date;
	public license_expiry: Date;
	public min_license_expiry: Date;

	constructor(
		private _driverService: DriverService,
		private _companyService: CompanyService,
		private _cityService: CityService,
		private _stateService: StateService,
		private _global: GlobalService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _formBuilder: FormBuilder
	) {

		// Construct form group
		this._form = _formBuilder.group({

			driver_name: ['', Validators.compose([
				Validators.required,
				Validators.minLength(5),
				Validators.maxLength(50)
			])],
			address1: ['', Validators.compose([
				Validators.required,
				Validators.minLength(5),
				Validators.maxLength(100)
			])],
			address2: ['', Validators.compose([
				Validators.minLength(5),
				Validators.maxLength(100)
			])],
			city_id: ['', Validators.compose([
				Validators.required
			])],
			state_id: ['', Validators.compose([
				Validators.required
			])],
			pincode: ['', Validators.compose([
				Validators.required
			])],
			joining_date: ['', Validators.compose([
				Validators.required
			])],
			salary: ['', Validators.compose([
				Validators.required
			])],
			license_no: ['', Validators.compose([
				Validators.required,
			])],
			license_expiry: ['', Validators.compose([
				Validators.required
			])],
			mobile: ['', Validators.compose([
				Validators.required
			])],
			bloodgroup: ['', Validators.compose([])],
		});


		this._form.valueChanges.subscribe(data => this.onValueChanged(data));

		this._bloodGroups = DriverService.getBloodGroups();
		this.datepickerConfig = Object.assign({}, {
			showWeekNumbers: false,
			containerClass: 'theme-dark-blue',
			dateInputFormat: environment.dateFormat
		});
	}

	get driver_name() { return this._form.get('driver_name'); }
	get address1() { return this._form.get('address1'); }
	get address2() { return this._form.get('address2'); }

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
				this._driverService.get(this._id)
				.subscribe(
					model => {
						this._model = model;
						this._mode = 'update';
						this._loading = false;

						this.joining_date = new Date(this._model.joining_date);
						this.license_expiry = new Date(this._model.license_expiry);
					},
					error => {
						this._loading = false;
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
				this._loading = false;
				this.joining_date = new Date();
				this.license_expiry = new Date();

			}
		});
		this.getCompanies();
		this.getCities();
		this.getStates();
	}

	public ngOnDestroy() {
		this._parameters.unsubscribe();
		this._model = new Driver();
	}

	public onSubmit() {
		this._submitted = true;
		this._errorMessage = '';
		this._successMessage = '';
		this._resetFormErrors();
		if (this._mode === 'create') {
			this._driverService.add(this._model).subscribe(
				result => {
					if (result.success) {
						// this._router.navigate(['/vehicle/driver']);
						this._errorMessage = '';
						this._successMessage = result.data.driver_name + ' driver created successsfully!';
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
			this._driverService.update(this._model).subscribe(
				result => {
					if (result.success) {
						// this._router.navigate(['/vehicle/driver']);
						this._errorMessage = '';
						this._successMessage = result.data.driver_name + ' driver updated successsfully!';
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

	public getCompanies() {
		this._companies = null;
		this._companyService.getAll().subscribe(
			models => {
				this._companies = models;
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

	public getStates() {
		this._states = null;
		this._stateService.getAll().subscribe(
			models => {
				this._states = models;
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

	onCityChange(event) {
		const city_id = event.target.value;
		this._cityService.get(city_id).subscribe(
			item => {
				this._model.state_id = item.state_id;
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

	onStateChange(event) {
		const state_id = event.target.value;
		this._cityService.getByState(state_id).subscribe(
			models => {
				this._cities = models;
				this._model.city_id = null;
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

	public onChangeDate(type: string, dateTime: string) {
		let formattedDateTime: string = null;
		let formattedDateTime1: string = null;
		if (moment(dateTime).isValid()) {
			formattedDateTime = moment(dateTime).format('YYYY-MM-DD');
			formattedDateTime1 = moment(dateTime).add(1, 'days').format('YYYY-MM-DD');
		}

		if (type === 'joining_date') {
			this._model.joining_date = formattedDateTime;
			this.license_expiry = null;
			this.min_license_expiry = new Date(formattedDateTime1);
		}

		if (type === 'license_expiry') {
			this._model.license_expiry = formattedDateTime;
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
			bloodgroup: {valid: true, message: ''},
			mobile: {valid: true, message: ''},
			license_expiry: {valid: true, message: ''},
			license_no: {valid: true, message: ''},
			salary: {valid: true, message: ''},
			joining_date: {valid: true, message: ''},
			pincode: {valid: true, message: ''},
			state_id: {valid: true, message: ''},
			city_id: {valid: true, message: ''},
			address2: {valid: true, message: ''},
			address1: {valid: true, message: ''},
			driver_name: {valid: true, message: ''},

		};
	}

	private _resetModel() {
		this._model = new Driver();
		this._model.driver_name = '';
		this._model.address1    = '';
		this._model.address2 = '';
		this._model.city_id = null ;
		this._model.state_id  = null;
		this._model.pincode = null;
		this._model.joining_date    = '';
		this._model.salary          = '';
		this._model.license_no      = '';
		this._model.license_expiry  = '';
		this._model.mobile      = '';
		this._model.bloodgroup  = null;

	}
}
