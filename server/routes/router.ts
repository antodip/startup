/// <reference path="../../typings/index.d.ts" />

// Interfaces
import * as Hapi from "hapi";
import * as IServer from "../interfaces/iServerConfig" 

/**
 * config reference:
 * http://hapijs.com/api#route-options
 **/

export class Router {
	method: string | string[];
	path: string;
	handler: any;
	config: Hapi.IRouteAdditionalConfigurationOptions;

	constructor(method: string|string[], path: string, config: Hapi.IRouteAdditionalConfigurationOptions) {
		this.method = method;
		this.path = path;
		this.config = config;
	}

	get(): Hapi.IRouteConfiguration {
		let route: Hapi.IRouteConfiguration = {
			method: this.method,
			path: this.path,
            handler: undefined
		}
        route.config = this.config;

		return route;
	}
}

