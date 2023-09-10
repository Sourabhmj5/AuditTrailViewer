/**
 * @description       : 
 * @author            : Sourabh Bhattacharjee
 * @group             : 
 * @last modified on  : 09-04-2023
 * @last modified by  : Sourabh Bhattacharjee 
 * Modifications Log
 * Ver   Date         Author                  Modification
 * 1.0   09-04-2023   Sourabh Bhattacharjee   Initial Version
**/
import { LightningElement, track } from 'lwc';
import getRecords from '@salesforce/apex/AuditTrailViewerCtrl.getRecords';

export default class AuditTrailViewer extends LightningElement {
    @track _records = [];
    @track error;
    queryOffset;
    queryLimit;
    totalRecordCount;
    @track columns = [{
            label: 'Action',
            fieldName: 'Action',
            type: 'text'
        },
        {
            label: 'Display',
            fieldName: 'Display',
            type: 'text'
        },
        {
            label: 'Section',
            fieldName: 'Section',
            type: 'text'
        },
        {
            label: 'Created By',
            fieldName: 'CreatedByName',
            type: 'text'
        },
        {
            label: 'Created Date',
            fieldName: 'CreatedDate',
            type: "date",
            typeAttributes:{
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        }

    ];

    constructor(){
        super();
        this.queryOffset = 0;
        this.queryLimit = 10;
        this.loadRecords();
    }

    loadMoreData(event){
        const { target } = event;
        //Display a spinner to signal that data is being loaded
        target.isLoading = true;
        if(this.totalRecordCount > this.queryOffset){
            this.queryOffset = this.queryOffset + 10;
            this.loadRecords()
                .then(()=> {
                    target.isLoading = false;
                });
        } else {
            target.isLoading = false;
        }

    }

    loadRecords(){
        let flatData;
        return getRecords({queryLimit: this.queryLimit, queryOffset: this.queryOffset})
        .then(result => {
            this.totalRecordCount = result.totalRecordCount;
            flatData = JSON.parse(JSON.stringify(result.auditTrailRecords));
            flatData.forEach(function(entry) {
                // flatten the data to that it can be directly consumed by data table
                if (entry.CreatedBy){
                    entry.CreatedByName = entry.CreatedBy.Name;
                }
            });
            let updatedRecords = [...this._records, ...flatData];
            this._records = updatedRecords;
            this.error = undefined;
        })
        .catch(error => {
            this.error = error ;
        })
    }

    get records() {
        return this._records.length ? this._records : null;
    }

}