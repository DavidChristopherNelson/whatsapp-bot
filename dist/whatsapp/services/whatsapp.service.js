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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
let WhatsappService = class WhatsappService {
    constructor(config) {
        this.config = config;
    }
    async uploadMedia(file, mime) {
        const baseUrl = 'https://graph.facebook.com';
        const version = this.config.get('WA_API_VERSION');
        const phoneId = this.config.get('WA_PHONE_NUMBER_ID');
        const token = this.config.get('WA_ACCESS_TOKEN');
        const url = `${baseUrl}/${version}/${phoneId}/media`;
        const form = new form_data_1.default();
        form.append('file', file, { filename: 'upload', contentType: mime });
        form.append('messaging_product', 'whatsapp');
        form.append('type', mime);
        const headers = {
            ...form.getHeaders(),
            Authorization: `Bearer ${token}`,
        };
        const res = await axios_1.default.post(url, form, { headers });
        return res.data?.id;
    }
    async sendAudioByMediaId(toWaId, mediaId) {
        const baseUrl = 'https://graph.facebook.com';
        const version = this.config.get('WA_API_VERSION');
        const phoneId = this.config.get('WA_PHONE_NUMBER_ID');
        const token = this.config.get('WA_ACCESS_TOKEN');
        const url = `${baseUrl}/${version}/${phoneId}/messages`;
        const payload = {
            messaging_product: 'whatsapp',
            to: toWaId,
            recipient_type: 'individual',
            type: 'audio',
            audio: { id: mediaId },
        };
        try {
            await axios_1.default.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
        }
        catch (err) {
            const details = err?.response?.data ?? err?.message ?? String(err);
            throw new Error(`sendAudioByMediaId failed: ${JSON.stringify(details)}`);
        }
    }
    async getMediaUrl(mediaId) {
        const baseUrl = 'https://graph.facebook.com';
        const version = this.config.get('WA_API_VERSION');
        const token = this.config.get('WA_ACCESS_TOKEN');
        const url = `${baseUrl}/${version}/${mediaId}`;
        const res = await axios_1.default.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data?.url;
    }
    async downloadMedia(url) {
        const token = this.config.get('WA_ACCESS_TOKEN');
        const res = await axios_1.default.get(url, {
            responseType: 'arraybuffer',
            headers: { Authorization: `Bearer ${token}` },
        });
        return Buffer.from(res.data);
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map