import { Component } from "@angular/core";
import * as test from "tape";
import { async, inject, ComponentFixture, TestBed } from "@angular/core/testing";
import { StatusLedComponent } from "../app/statusLed.component";
import { RepositoryService } from "../app/repository.service";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import * as sinon from "sinon";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

class MockRepositoryService {

    private _syncStatus$ = new Subject<boolean>();

    get SyncStatus$() {
        return this._syncStatus$.asObservable();
    }

    public refreshStatus() {
        this._syncStatus$.next(true);
    }
}


function beforeEach(): Promise<{
    component: ComponentFixture<StatusLedComponent>,
    service: MockRepositoryService
}> {

    return new Promise((resolve, reject) => {

        let componentFixture: ComponentFixture<StatusLedComponent>;
        let stubService: MockRepositoryService;

        TestBed.resetTestEnvironment();
        TestBed
            .initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
            .configureTestingModule({
                declarations: [StatusLedComponent],
                providers: [
                    { provide: RepositoryService, useClass: MockRepositoryService }
                    // per usare un oggetto instanziato (ad es. con sinon) usare useValue
                ]

            });
        TestBed.compileComponents()
            .then(() => {
                let instance = inject([RepositoryService], (service: MockRepositoryService) => {

                    stubService = service;
                    componentFixture = TestBed.createComponent(StatusLedComponent);
                    componentFixture.detectChanges();
                    return componentFixture.whenStable();
                });
                instance();
            })
            .then(() => {
                resolve({
                    component: componentFixture,
                    service: stubService
                });
            });

    });

}




test("Component statusLed", t => {

    beforeEach()
        .then((fixture) => {

            let statusLed = fixture.component.componentInstance;
            let element = fixture.component.nativeElement;

            let title = element.querySelector("p").innerText;
            t.equal(title, "Status Led");

            t.equal(statusLed.ledUrl, "../icons/ballGreen.png");
            t.end();
        });

});



