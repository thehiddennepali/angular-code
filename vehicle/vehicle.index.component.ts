import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';

import swal, { SweetAlertOptions } from 'sweetalert2';

import { Vehicle } from '../../../classes/vehicle';
import { GlobalService } from '../../../services/global.service';
import { VehicleService } from '../../../services/vehicle.service';

declare var $: any;

@Component({
	selector: 'app-vehicle',
	templateUrl: './vehicle.index.component.html',
	styleUrls: ['./vehicle.index.component.scss']
})
export class VehicleIndexComponent implements OnInit {

	public _models: Vehicle[];
	public _errorMessage: string;
	public _successMessage: string;
	public _loading: boolean = true;

	constructor(
		private _http: Http,
		private _vehicleService: VehicleService,
		private _global: GlobalService,
		private _router: Router
	) { }

	ngOnInit() {
		this.getVehicles();
		const that = this;
	}

	public getVehicles() {
		this._models = null;
		this._vehicleService.getAll(['Id', 'v_no', 'vehicle_company_id', 'vehicle_model_id']).subscribe(
			models => {
				this._models = models;
				this._loading = false;
				$.getScript('assets/js/scripts.js');
			},
			error =>  {
				this._loading = false;
				// unauthorized access
				if (error.status === 401 || error.status === 403) {
					this._global.unauthorizedAccess(error);
				} else {
					this._errorMessage = error.data.message;
				}
			}
		);
	}

	public update(model: Vehicle): void {
		this._router.navigate(['/vehicle/vehicle', model.Id]);
	}

	public delete(model: Vehicle): void {
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
					parent._vehicleService.delete(model.Id).subscribe(
						result => {
							$('#data-table').DataTable().clear().destroy();
							parent.getVehicles();
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
