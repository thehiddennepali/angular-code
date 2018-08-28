import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { State } from '../../../classes/state';
import { StateService } from '../../../services/state.service';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { GlobalService } from '../../../services/global.service';
declare var $: any;

@Component({
	selector: 'app-state',
	templateUrl: './state.index.component.html',
	styleUrls: ['./state.index.component.scss']
})
export class StateIndexComponent implements OnInit   {

	public _states: State[];
	public _errorMessage: string;
	public _successMessage: string;

	filter = new State();

	constructor(
		private _stateService: StateService,
		private _router: Router,
		private _global: GlobalService,
		private cdRef: ChangeDetectorRef

	) { }

	ngOnInit() {
		this.getStates();
	}

	public addSearchInput() {
		const table = $('#data-table').DataTable();
		table.row.add( [
			'',
			'<input #model="ngModel" (keyup.enter)="search($event)" [(ngModel)]="filter.state_name" type="text" class="form-control"/>',
			'<input #model="ngModel" (keyup.enter)="search($event)" [(ngModel)]="filter.state_short_name" type="text" class="form-control"/>',
			''
		] ).draw( false );
	}


	public search() {
		this._stateService.search(this.filter)
		.subscribe(
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

	public getStates() {
		this._states = null;
		this._stateService.getAllStates()
		.subscribe(
			models => {
				this._states = models;
				$.getScript('assets/js/scripts.js');
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

	public update(model: State): void {
		this._router.navigate(['/vehicle/state', model.Id]);
	}

	public delete(model: State): void {
		// Due to sweet alert scope issue, define as function variable and pass to swal

		const parent = this;

		this._errorMessage = '';

		swal({
			title: 'Are you sure?',
			text: 'Once delete, you won\'t be able to revert this!',
			type: 'question',
			showLoaderOnConfirm: true,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!',
			preConfirm: function () {
				return new Promise(function (resolve, reject) {
					parent._stateService.delete(model.Id).subscribe(
						result => {
							$('#data-table').DataTable().clear().destroy();

							parent.getStates();
							resolve();
						},
						error =>  {
							// unauthorized access
							if (error.status === 401 || error.status === 403) {
								parent._global.unauthorizedAccess(error);
							} else {
								parent._errorMessage = error.data.message;
							}
							resolve();

						}
					);
				});
			}
		}).then(function(result) {
			// handle confirm, result is needed for modals with input

		}, function(dismiss) {
			// dismiss can be "cancel" | "close" | "outside"
		});
	}

	public hideSuccessMessage() {
		this._successMessage = '';
	}

	public hideErrorMessage() {
		this._errorMessage = '';
	}
}
