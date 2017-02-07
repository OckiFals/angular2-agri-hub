import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { NodeService } from '../nodes/node.service';
import { SensorService } from './sensor.service';
import { Node } from '../nodes/node.model';
import { Sensor } from './sensor.model';

import { CredentialsService } from '../core/authenticate/credentials.service';
import { AuthenticateService } from '../core/authenticate/authenticate.service';
import { IsResearcherComponent } from '../core/authenticate/authenticate.component';

@Component({
    moduleId: '../views/sensors/',
    selector: 'sensor-new',
    templateUrl: 'sensor-form.tpl.html'
})
export class SensorNewComponent extends IsResearcherComponent implements OnInit {
    parentNode: Node;
    sensor: Sensor;
    is_new: boolean = true;
    links: any[];

    errors: Array<{ field: string, message: string }>;

    constructor(
        private nodeService: NodeService,
        private sensorService: SensorService,
        private route: ActivatedRoute,
        private credentialsService: CredentialsService,
        public router: Router,
        public authenticateService: AuthenticateService 
    ){
        super(router, authenticateService);
        super.ngOnInit();
    }

    ngOnInit() {
        this.getNodes();
        this.sensor = new Sensor;
    }

    getNodes(): void {
        this.route.params
            .switchMap((params: Params) => this.nodeService.getNode(params['nodeid']))
            .subscribe(
                node => {
                    this.setUpNode(node);
                },
                error => console.log(error)
            );
    }

    save(): void {
        this.sensorService.save(this.parentNode, this.sensor)
            .subscribe(
                sensor => this.router.navigate(['/nodes/', this.parentNode.id, 'sensors']),
                error => console.log(error)
            );
    }

    private setUpNode(node: Node): void {
        this.parentNode = node;
        // raise 403 when node is not owned by this auth user
        if (node.user != this.credentialsService.getUser().username) {
            this.router.navigate(['/403']);
        }
        this.links = [
            { label: "Home", url: "/" },
            { label: "Nodes", url: "/nodes/" },
            { label: node.label, url: `/nodes/view/${node.id}` },
            { label: "Sensors", url: `/nodes/${node.id}/sensors` },
            { label: "New", is_active: true }
        ];
    }

    private extractErrors(err: any): void {
        let errorsParse = JSON.parse(err._body);
        this.errors = [];
        for(let index in errorsParse) {
            if(errorsParse.hasOwnProperty(index)) {
                this.errors.push({
                    field: index,
                    message: typeof errorsParse[index] === 'string' ? 
                        errorsParse[index]: errorsParse[index][0]
                })
            }
        }
    }
}