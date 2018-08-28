import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';

import swal, { SweetAlertOptions } from 'sweetalert2';

import { City } from '../../../classes/city';
import { GlobalService } from '../../../services/global.service';
import { CityService } from '../../../services/city.service';
declare var $: any;
@Component({
	selector: 'app-city',
	templateUrl: './city.index.component.html',
	styleUrls: ['./city.index.component.scss']
})
export class CityIndexComponent implements OnInit {

	public _cities: City[];
	public _errorMessage: string;
	public _successMessage: string;

	constructor(
		private _http: Http,
		private _cityService: CityService,
		private _global: GlobalService,
		private _router: Router
	) { }

	ngOnInit() {
		this.getUsers();
		const that = this;
	}

	public getUsers() {
		this._cities = null;
		this._cityService.getAll().subscribe(
			models => {
				this._cities = models;
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

	public update(model: City): void {
		this._router.navigate(['/vehicle/city', model.Id]);
	}

	public delete(model: City): void {
		// Due to sweet alert scope issue, define as function variable and pass to swal

		const parent = this;
		// let getUsers = this.getUsers;
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
					parent._cityService.delete(model.Id).subscribe(
						result => {
							$('#data-table').DataTable().clear().destroy();
							parent.getUsers();
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
