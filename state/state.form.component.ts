import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { State } from '../../../classes/state';
import { StateService } from '../../../services/state.service';
import { GlobalService } from '../../../services/global.service';

import * as moment from 'moment';

@Component({
	selector: 'app-state',
	templateUrl: './state.form.component.html',
	styleUrls: ['./state.form.component.scss']
})
export class StateFormComponent implements OnInit, OnDestroy {

	public _mode: string = '';
	public _id: number;
	public _parameters: any;
	public _model: State;
	public _errorMessage: string;
	public _successMessage: string;
	public _form: FormGroup;
	public _formErrors: any;
	public _submitted: boolean = false;

	constructor(
		private _userService: StateService,
		private _global: GlobalService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _formBuilder: FormBuilder
	) {

		// Construct form group
		this._form = _formBuilder.group({
			state_name: ['', Validators.compose([
				Validators.required
			])],
			state_short_name: ['', Validators.compose([
				Validators.required
			])],
		});

		this._form.valueChanges.subscribe(data => this.onValueChanged(data));
	}

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
				this._userService.get(this._id)
				.subscribe(
					state => {
						this._model = state;
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
	}

	public ngOnDestroy() {
		this._parameters.unsubscribe();
		this._model = new State();
	}

	public onSubmit() {
		this._submitted = true;
		this._resetFormErrors();
		if (this._mode === 'create') {
			this._userService.add(this._model)
			.subscribe(
				result => {
					if (result.success) {
						// this._router.navigate(['/vehicle/state']);
						this._errorMessage = '';
						this._successMessage = 'State created successsfully!';
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
			this._userService.update(this._model)
			.subscribe(
				result => {
					if (result.success) {
						// this._router.navigate(['/vehicle/state']);
						this._errorMessage = '';
						this._successMessage = 'State updated successsfully!';
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
			state_name: {valid: true, message: ''},
			state_short_name: {valid: true, message: ''}
		};
	}

	private _resetModel() {
		this._model = new State();
		this._model.country_id = 1;
		this._model.state_name = '';
		this._model.state_short_name = '';

	}
}
