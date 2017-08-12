import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NodeService } from './node.service';
import { Node } from './node.model';
import 'rxjs/add/operator/switchMap';
import { CredentialsService } from '../core/authenticate/credentials.service';

@Component({
    moduleId: '../views/nodes/',
    selector: 'node-edit',
    templateUrl: 'node-form.tpl.html'
})
export class NodeEditComponent {
    links: any[];
    node: Node;
    unlimited: boolean;
    _initial_pubsperday: number;

    errors: Array<{ field: string, message: string}>;

    constructor(
        private nodeService: NodeService,
        private route: ActivatedRoute,
        private credentialsService: CredentialsService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.nodeService.getNode(params['id']))
            .subscribe(
                node => this.setUpNode(node),
                error => console.log(error)
            );
        // TODO why?
        this.node = new Node;
    }

    private setUpNode(node: Node): void {
        // raise 403 when node is not owned by this auth user
        if (node.user != this.credentialsService.getUser().username) {
            this.router.navigateByUrl('/403', { skipLocationChange: true });
        }
        this.node = node;
        this.unlimited = (-1 == node.pubsperday);
        this._initial_pubsperday = node.pubsperday;
        this.links = [
            { label: "Home", url: "/" },
            { label: "Nodes", url: "/nodes/" },
            { label: this.node.label, url: `/nodes/view/${node.id}` },
            { label: "Edit", is_active: true }
        ];
    }

    unlimitedStateChange(): void {
        if (this.unlimited) {
            this.node.pubsperday = -1;
        } else {
            this.node.pubsperday = (-1 == this._initial_pubsperday) ? 0 : 
                this._initial_pubsperday;
        }
    }

    save(): void {
        this.node.is_public = this.node.is_public ? 1 : 0;
        this.nodeService.save(this.node)
            .subscribe(
                node => this.router.navigate(['/nodes/view', node.id]),
                error => this.extractErrors(error)
            );
    }

    delete(): void {
        if(confirm("Are you sure?")) {
            this.nodeService.delete(this.node.url)
                .subscribe(
                    () => this.router.navigate(['/nodes/']),
                    error => this.extractErrors(error)
                );
        }
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

    public closeAlert(alert: any) {
        const index: number = this.errors.indexOf(alert);
        this.errors.splice(index, 1);
    }
}