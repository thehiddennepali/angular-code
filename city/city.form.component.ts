import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CityService } from '../../../services/city.service';
import { StateService } from '../../../services/state.service';
import { City } from '../../../classes/city';
import { State } from '../../../classes/state';
import { GlobalService } from '../../../services/global.service';

import * as moment from 'moment';

@Component({
	selector: 'app-city',
	templateUrl: './city.form.component.html',
	styleUrls: ['./city.form.component.scss']
})
export class CityFormComponent implements OnInit, OnDestroy {

	public _mode: string = '';
	public _id: number;
	public _parameters: any;
	public _model: City;
	public _states: State[];
	public _errorMessage: string;
	public _successMessage: string;
	public _form: FormGroup;
	public _formErrors: any;
	public _submitted: boolean = false;

	constructor(
		private _cityService: CityService,
		private _stateService: StateService,
		private _global: GlobalService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _formBuilder: FormBuilder
	) {

		// Construct form group
		this._form = _formBuilder.group({
			state_id: ['', Validators.compose([
				Validators.required,
			])],
			city_name: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(50)
			])],
			city_short_name: ['', Validators.compose([
				Validators.required,
				Validators.minLength(1),
				Validators.maxLength(10)
			])],
			pincode: ['', Validators.compose([
				Validators.required
			])],
			std: ['', Validators.compose([
				Validators.required
			])]
		});

		this._form.valueChanges.subscribe(data => this.onValueChanged(data));
	}

	get city_name() { return this._form.get('city_name'); }
	get city_short_name() { return this._form.get('city_short_name'); }

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
				this._cityService.get(this._id)
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
		this.getStates();
	}

	public ngOnDestroy() {
		this._parameters.unsubscribe();
		this._model = new City();
	}

	public onSubmit() {
		this._submitted = true;
		this._resetFormErrors();
		this._errorMessage = '';
		this._successMessage = '';
		if (this._mode === 'create') {
			this._cityService.add(this._model).subscribe(
				result => {
					if (result.success) {
						// this._router.navigate(['/vehicle/city']);
						this._errorMessage = '';
						this._successMessage = result.data.city_name + ' city created successsfully!';
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
			this._cityService.update(this._model).subscribe(
				result => {
					if (result.success) {
						// this._router.navigate(['/vehicle/city']);
						this._errorMessage = '';
						this._successMessage = result.data.city_name + ' city updated successsfully!';
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
			state_id: {valid: true, message: ''},
			city_name: {valid: true, message: ''},
			city_short_name: {valid: true, message: ''},
			pincode: {valid: true, message: ''},
			std: {valid: true, message: ''},
		};
	}

	private _resetModel() {
		this._model = new City();
		this._model.state_id = null;
		this._model.city_name = '';
		this._model.city_short_name = '';
		this._model.pincode = '';
		this._model.std = '';
	}
}
