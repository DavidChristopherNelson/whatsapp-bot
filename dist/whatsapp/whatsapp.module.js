"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappModule = void 0;
const common_1 = require("@nestjs/common");
const webhook_controller_1 = require("./controllers/webhook.controller");
const whatsapp_service_1 = require("./services/whatsapp.service");
const media_service_1 = require("./services/media.service");
const reply_service_1 = require("./services/reply.service");
const signature_guard_1 = require("../common/guards/signature.guard");
let WhatsappModule = class WhatsappModule {
};
exports.WhatsappModule = WhatsappModule;
exports.WhatsappModule = WhatsappModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [webhook_controller_1.WebhookController],
        providers: [whatsapp_service_1.WhatsappService, media_service_1.MediaService, reply_service_1.ReplyService, signature_guard_1.SignatureGuard],
    })
], WhatsappModule);
//# sourceMappingURL=whatsapp.module.js.map