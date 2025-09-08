"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.use((0, express_1.json)({
        verify: (req, _res, buf) => {
            req.rawBody = buf;
        },
    }));
    app.use((0, express_1.urlencoded)({
        extended: true,
        verify: (req, _res, buf) => {
            req.rawBody = buf;
        },
    }));
    const port = Number(config.get('PORT')) || 3050;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map