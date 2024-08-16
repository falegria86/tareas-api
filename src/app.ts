import { envs } from "./config/envs";
import { AppRoutes } from "./routes";
import { Server } from "./server";

//Función autoinvocada
(() => {
    main();
})();

function main() {
    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes,
    });

    server.start();
}