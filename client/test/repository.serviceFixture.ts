import { Component } from "@angular/core";
import * as test from "tape";
import { fakeAsync, async, inject, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import * as sinon from "sinon";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Rx"; // NON USARE "rxjs/Observable" perchè non si ha accesso a tutti gli operatori
import { RepositoryService } from "../app/repository.service";
import { DataPoint } from "../app/dataPoint";





function beforeEach(): Promise<{
    repositoryService: RepositoryService,
    httpService: Http
}> {

    return new Promise((resolve, reject) => {

        let http = { get: (url: string, args: any) => { return undefined; } } as Http;

        TestBed.resetTestEnvironment();
        TestBed
            .initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
            .configureTestingModule({
                providers: [
                    RepositoryService,
                    { provide: Http, useValue: http }
                    // per usare un oggetto instanziato (ad es. con sinon) usare useValue
                ]

            });

        let instance = inject([RepositoryService, Http], (repService, http: Http) => {

            resolve({
                repositoryService: repService,
                httpService: http
            });
        });
        instance();

    });

}


test("Should get data", t => {

    beforeEach()
    .then((services) => {

        // setup
        let sut = services.repositoryService;
        let http = services.httpService;
        let date = new Date(2017, 0, 1).getTime();
        let response = Observable.of({
            json: () => [new DataPoint(10, date)]
        });
        sinon.stub(http, "get")
            .returns(response);

        // act
        let ret = sut.getData(10)
            .then((ret) => { // il then prefersico metterlo qui(innestato dentro l'atro then) per mantenere in unico punto tutta la logica del test

                // assert
                let expected: Ng2Point = {
                    x: date,
                    y: 10
                };
                t.deepEqual(ret[0], expected);
                t.end();

            });


    });

});




interface Ng2Point {
    x: number;
    y: number;
}
