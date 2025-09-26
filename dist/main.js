"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const express_1 = require("express");
const whatsapp_service_1 = require("./whatsapp/services/whatsapp.service");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const common_1 = require("@nestjs/common");
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
    try {
        const currentId = config.get('WA_PLEASE_VOICE_MEDIA_ID');
        if (!currentId) {
            const assetPath = path.resolve(process.cwd(), 'assets/please-use-voice-message.ogg');
            const buf = await fs_1.promises.readFile(assetPath);
            const wa = app.get(whatsapp_service_1.WhatsappService);
            const newId = await wa.uploadMedia(buf, 'audio/ogg');
            common_1.Logger.log(`Uploaded default voice media. Copy this media_id into your .env as WA_PLEASE_VOICE_MEDIA_ID=${newId}`);
        }
    }
    catch (err) {
        common_1.Logger.warn(`Startup media upload skipped/failed: ${err.message}`);
    }
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map