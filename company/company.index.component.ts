import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal, { SweetAlertOptions } from 'sweetalert2';

import { Company } from '../../../classes/company';
import { CompanyService } from '../../../services/company.service';
import { GlobalService } from '../../../services/global.service';
declare var $: any;
@Component({
	selector: 'app-company.index',
	templateUrl: './company.index.component.html',
	styleUrls: ['./company.index.component.scss']
})
export class CompanyIndexComponent implements OnInit {

	public _companies: Company[];
	public _total_companies: number;
	public _errorMessage: string;
	public _successMessage: string;

	constructor(
		private _companyService: CompanyService,
		private _global: GlobalService,
		private _router: Router
	) {}

	ngOnInit() {
		this.getCompanyes();
	}

	public getCompanyes() {
		this._companies = null;
		this._companyService.getAll().subscribe(
			models => {
				this._companies = models;
				this._total_companies = Object.keys(models).length;
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

	public updateCompany(company: Company): void {
		this._router.navigate(['/vehicle/company', company.Id]);
	}

	public deleteCompany(company: Company): void {
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
					parent._companyService.delete(company.Id)
					.subscribe(
						result => {
							parent.getCompanyes();
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
