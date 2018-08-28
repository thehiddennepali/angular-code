import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal, { SweetAlertOptions } from 'sweetalert2';

import { Branch } from '../../../classes/branch';
import { BranchService } from '../../../services/branch.service';
import { GlobalService } from '../../../services/global.service';
declare var $: any;
@Component({
	templateUrl: './branch.index.component.html',
	styleUrls: ['./branch.index.component.scss']
})
export class BranchIndexComponent implements OnInit {

	public _branches: Branch[];
	public _errorMessage: string;
	public _successMessage: string;

	constructor(
		private _branchService: BranchService,
		private _global: GlobalService,
		private _router: Router
	) {}

	ngOnInit() {
		this.getBranches();
	}

	public getBranches() {
		this._branches = null;
		this._branchService.getAll().subscribe(
			models => {
				this._branches = models;
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

	public update(model: Branch): void {
		this._router.navigate(['/vehicle/branch', model.Id]);
	}

	public delete(model: Branch): void {
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
					parent._branchService.delete(model.Id)
					.subscribe(
						result => {
							$('#data-table').DataTable().clear().destroy();
							parent.getBranches();
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
