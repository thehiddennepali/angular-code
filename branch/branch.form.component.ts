import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BranchService } from '../../../services/branch.service';
import { CompanyService } from '../../../services/company.service';
import { CityService } from '../../../services/city.service';
import { StateService } from '../../../services/state.service';
import { Branch } from '../../../classes/branch';
import { Company } from '../../../classes/company';
import { City } from '../../../classes/city';
import { State } from '../../../classes/state';
import { GlobalService } from '../../../services/global.service';

import * as moment from 'moment';

@Component({
	selector: 'app-branch',
	templateUrl: './branch.form.component.html',
	styleUrls: ['./branch.form.component.scss']
})
export class BranchFormComponent implements OnInit, OnDestroy {

	public _mode: string = '';
	public _id: number;
	public _parameters: any;
	public _model: Branch;
	public _companies: Company[];
	public _cities: City[];
	public _states: State[];
	public _errorMessage: string;
	public _successMessage: string;
	public _form: FormGroup;
	public _formErrors: any;
	public _submitted: boolean = false;

	constructor(
		private _branchService: BranchService,
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
			company_id: ['', Validators.compose([
				Validators.required
			])],
			branch: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])],
			branch_short_name: ['', Validators.compose([
				Validators.required,
				Validators.minLength(2),
				Validators.maxLength(10)
			])],
			labour_rate_perkg: ['', Validators.compose([
			])],
			prop_name: ['', Validators.compose([
				Validators.required
			])],
			address: ['', Validators.compose([
				Validators.required
			])],
			city_id: ['', Validators.compose([
				Validators.required
			])],
			state_id: ['', Validators.compose([
				Validators.required
			])],
			pincode: ['', Validators.compose([
				Validators.required,
			])],
			mobile: ['', Validators.compose([
				Validators.required
			])],
			phone: ['', Validators.compose([
				Validators.required
			])],
			reg_no: ['', Validators.compose([
			])],
			gstin_no: ['', Validators.compose([
			])],
			pan_no: ['', Validators.compose([
			])],
			contact_person: ['', Validators.compose([
				Validators.required
			])],
			email: ['', Validators.compose([
				Validators.required
			])],
			website: ['', Validators.compose([
				Validators.required
			])]
		});


		this._form.valueChanges.subscribe(data => this.onValueChanged(data));
	}

	get branch() { return this._form.get('branch'); }
	get branch_short_name() { return this._form.get('branch_short_name'); }

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
				this._branchService.get(this._id)
				.subscribe(
					model => {
						this._model = model;
						this._mode = 'update';
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
		this.getCompanies();
		this.getCities();
		this.getStates();
	}

	public ngOnDestroy() {
		this._parameters.unsubscribe();
		this._model = new Branch();
	}

	public onSubmit() {
		this._submitted = true;
		this._successMessage = '';
		this._resetFormErrors();
		if (this._mode === 'create') {
			this._branchService.add(this._model)
			.subscribe(
				result => {
					if (result.success) {
						// this._router.navigate(['/vehicle/branch']);
						this._errorMessage = '';
						this._successMessage = result.data.branch + ' branch created successsfully!';
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
			this._branchService.update(this._model)
			.subscribe(
				result => {
					if (result.success) {
						// this._router.navigate(['/vehicle/branch']);
						this._errorMessage = '';
						this._successMessage = result.data.branch + ' branch updated successsfully!';
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

	onCityChange(event) {
		const city_id = event.target.value;
		this._cityService.get(city_id).subscribe(
			model => {
				this._model.state_id = model.state_id;
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
			company_id: {valid: true, message: ''},
			branch: {valid: true, message: ''},
			branch_short_name: {valid: true, message: ''},
			labour_rate_perkg: {valid: true, message: ''},
			prop_name: {valid: true, message: ''},
			address: {valid: true, message: ''},
			city_id: {valid: true, message: ''},
			state_id: {valid: true, message: ''},
			pincode: {valid: true, message: ''},
			mobile: {valid: true, message: ''},
			phone: {valid: true, message: ''},
			reg_no: {valid: true, message: ''},
			gstin_no: {valid: true, message: ''},
			pan_no: {valid: true, message: ''},
			contact_person: {valid: true, message: ''},
			email: {valid: true, message: ''},
			website: {valid: true, message: ''}
		};
	}

	private _resetModel() {
		this._model = new Branch();
		this._model.company_id        = null;
		this._model.branch            = '';
		this._model.branch_short_name = '';
		this._model.labour_rate_perkg = '';
		this._model.prop_name         = '';
		this._model.address           = '';
		this._model.city_id           = null;
		this._model.state_id          = null;
		this._model.pincode           = '';
		this._model.mobile            = '';
		this._model.phone             = '';
		this._model.reg_no            = '';
		this._model.gstin_no          = '';
		this._model.pan_no            = '';
		this._model.contact_person    = '';
		this._model.email             = '';
		this._model.website           = '';
	}
}
