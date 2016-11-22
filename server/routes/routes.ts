import * as Hapi from "hapi";
import * as Path from "path";


export default function (server: Hapi.Server, rootPath: string) {

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: Path.join(rootPath, './client'),
                redirectToSlash: true,
                index: true
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/node_modules/{file*}',
        handler: {
            directory: {
                path: Path.join(rootPath, './node_modules'),
                listing: true
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/dist/{f*}',
        handler: {
            directory: {
                path: Path.join(rootPath, './dist'),
                listing: true
            }
        }
    });
}