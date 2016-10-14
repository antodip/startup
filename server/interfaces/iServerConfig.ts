export interface Endpoint {
	method: string|string[],
	path: string,
	handler?: Function
}

export interface RouteConfig {
	auth: any,
	cache?: {
		expiresIn: number,
		privacy: string
	}
}