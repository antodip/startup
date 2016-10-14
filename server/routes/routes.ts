import * as Hapi from "hapi";
import * as Path from "path";


export default function(server: Hapi.Server) {

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
               path: Path.join(__dirname, '../../client'),
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
               path: Path.join(__dirname, '../../node_modules'),
               listing: true

            }
        }
    });

  
}

