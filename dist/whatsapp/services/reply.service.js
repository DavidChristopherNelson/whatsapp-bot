"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyService = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("./whatsapp.service");
const config_1 = require("@nestjs/config");
const phone_util_1 = require("../../common/utils/phone.util");
let ReplyService = class ReplyService {
    constructor(whatsapp, config) {
        this.whatsapp = whatsapp;
        this.config = config;
    }
    async route(value) {
        const contactWaId = value.contacts?.[0]?.wa_id;
        const msg = value.messages?.[0];
        if (!contactWaId || !msg)
            return;
        if (msg.type === 'text') {
            const mediaId = this.config.get('WA_PLEASE_VOICE_MEDIA_ID');
            if (!mediaId)
                return;
            const to = (0, phone_util_1.toE164India)(contactWaId);
            await this.whatsapp.sendAudioByMediaId(to, mediaId);
        }
    }
};
exports.ReplyService = ReplyService;
exports.ReplyService = ReplyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService, config_1.ConfigService])
], ReplyService);
//# sourceMappingURL=reply.service.js.map