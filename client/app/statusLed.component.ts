import { Component, OnInit } from "@angular/core";
import { RepositoryService } from "./repository.service";

@Component({
    selector: "statusLed",
    templateUrl: "app/statusLed.component.html"
})

export class StatusLedComponent {

    public ledUrl: string;

    constructor(public repositoryService: RepositoryService) {
        this.ledUrl = "../icons/ballRed.png";

        this.repositoryService.SyncStatus$.subscribe((val) => {

            this.changeIconStatus(val);

        });
    }


    private changeIconStatus(val: boolean) {

        if (val)
            this.ledUrl = "../icons/ballGreen.png";
        else
            this.ledUrl = "../icons/ballRed.png";
    }

}
