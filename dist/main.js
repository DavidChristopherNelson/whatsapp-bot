"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const express_1 = require("express");
const fs_1 = require("fs");
const path_1 = require("path");
const whatsapp_service_1 = require("./whatsapp/services/whatsapp.service");
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
    await maybeUploadDefaultVoice(app.get(whatsapp_service_1.WhatsappService), config);
    const port = Number(config.get('PORT')) || 3050;
    await app.listen(port);
}
async function maybeUploadDefaultVoice(wa, config) {
    const existing = config.get('WA_PLEASE_VOICE_MEDIA_ID');
    if (existing)
        return;
    try {
        const wav = await fs_1.promises.readFile((0, path_1.join)(process.cwd(), 'assets/please-use-voice.wav'));
        const id = await wa.uploadMedia(wav, 'audio/wav');
        console.log(`Uploaded default voice prompt. media_id: ${id}`);
    }
    catch {
        console.log('Default voice asset not uploaded. Provide WA_PLEASE_VOICE_MEDIA_ID to skip.');
    }
}
bootstrap();
//# sourceMappingURL=main.js.map