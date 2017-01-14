import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { NodeService } from '../nodes/node.service';
import { SensorDataService } from './sensordata.service';
import { Node } from '../nodes/node.model';
import { SensorData } from './sensordata.model';

@Component({
    moduleId: module.id,
    selector: 'sensordata-node',
    templateUrl: 'sensordata.tpl.html'
})
export class SensorDataNodeComponent {
    node: Node;
    sensordatas: SensorData[];
    links: any[];
    title: string;
    page = 1;
    maxSize = 10;
    collectionSize: number;

    constructor(
        private nodeService: NodeService,
        private sensorDataService: SensorDataService,
        private router: Router, 
        private route: ActivatedRoute 
    ) {}
    
    ngOnInit() {
        this.links = [
            { label: "Home", url: "/" },
            { label: "Nodes", url: "/nodes/" }
        ];
        this.getNode();
    }

    getNode() {
        this.route.params
            .switchMap((params: Params) => this.nodeService.getNode(params['nodeid']))
            .subscribe(
                node => {
                    this.node = node;
                    this.title = node.label;
                    this.links.push(
                        { label: node.label, url: `/nodes/view/${node.id}` },
                        { label: "Sensor Data", is_active: true }
                    );
                    this.getSensorData();
                },
                error => console.log(error)
            );
    }

    getSensorData(): void {
        this.route.params
            .switchMap((params: Params) => this.sensorDataService.getSensorDataByNode(this.page, params['nodeid']))
            .subscribe(
                sensordatas => {
                    this.collectionSize = sensordatas.count;
                    this.sensordatas = sensordatas.results as SensorData[];
                },
                error => console.log(error)
            );
    }

    pageChange(): void {
        this.getSensorData();
    }
}