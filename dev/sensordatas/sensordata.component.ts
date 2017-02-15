import { Component, OnInit } from '@angular/core';
import { SensorDataService } from './sensordata.service';
import { SensorData } from './sensordata.model';

import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticateService } from '../core/authenticate/authenticate.service';
import { IsResearcherComponent } from '../core/authenticate/authenticate.component';

@Component({
    moduleId: '../views/sensordatas/',
    selector: 'sensordata-list',
    templateUrl: 'sensordata.tpl.html'
})
export class SensorDataComponent extends IsResearcherComponent implements OnInit {
    sensordatas: SensorData[];
    links: any[];
    title = "All";
    page = 1;
    maxSize = 10;
    collectionSize: number;

    date_start: string;
    date_end: string;

    constructor(
        private sensorDataService: SensorDataService,
        private route: ActivatedRoute,
        public router: Router,
        public authenticateService: AuthenticateService
    ) {
        super(router, authenticateService);
        super.ngOnInit();
    }
    
    ngOnInit() {
        this.getSensorData();
        this.links = [
            { label: "Home", url: "/" },
            { label: "Nodes", url: "/nodes/" },
            { label: "Sensor Data", is_active: true }
        ];
    }

    getSensorData(): void {
        this.sensorDataService.getSensorDataByUser(this.page, this.date_start, this.date_end)
            .subscribe(
                sensordatas => {
                    this.collectionSize = sensordatas.count;
                    this.sensordatas = sensordatas.results as SensorData[];
                },
                error => console.log(error)
            );
    }

    pageChange(): void {
        this.router.navigateByUrl(`sensordata?page=${this.page}`);
        this.getSensorData();
    }

    filter(): void {
        this.page = 1;
        this.pageChange();
    }

    clearFilter() {
        this.page = 1;
        this.date_start = "";
        this.date_end = "";
        this.pageChange();
    }
}