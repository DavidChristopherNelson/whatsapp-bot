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
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const config_1 = require("@nestjs/config");
let WhatsappService = class WhatsappService {
    constructor(config) {
        this.config = config;
        this.http = axios_1.default.create({ baseURL: this.getGraphBaseUrl() });
    }
    async uploadMedia(file, mime) {
        const phoneId = this.getPhoneNumberId();
        const form = new form_data_1.default();
        form.append('messaging_product', 'whatsapp');
        form.append('file', file, { filename: 'upload', contentType: mime });
        const headers = { ...this.getAuthHeader(), ...form.getHeaders() };
        const { data } = await this.http.post(`/${phoneId}/media`, form, { headers });
        return data.id;
    }
    async sendAudioByMediaId(toWaId, mediaId) {
        const phoneId = this.getPhoneNumberId();
        const payload = {
            messaging_product: 'whatsapp',
            to: toWaId,
            type: 'audio',
            audio: { id: mediaId },
        };
        await this.http.post(`/${phoneId}/messages`, payload, { headers: this.getAuthHeader() });
    }
    async getMediaUrl(mediaId) {
        const { data } = await this.http.get(`/${mediaId}`, { headers: this.getAuthHeader() });
        return data.url;
    }
    async downloadMedia(url) {
        const { data } = await this.http.get(url, {
            headers: this.getAuthHeader(),
            responseType: 'arraybuffer',
        });
        return Buffer.from(data);
    }
    getGraphBaseUrl() {
        const version = this.config.get('WA_API_VERSION');
        return `https://graph.facebook.com/${version}`;
    }
    getPhoneNumberId() {
        const id = this.config.get('WA_PHONE_NUMBER_ID');
        if (!id)
            throw new Error('WA_PHONE_NUMBER_ID not set');
        return id;
    }
    getAuthHeader() {
        const token = this.config.get('WA_ACCESS_TOKEN');
        if (!token)
            throw new Error('WA_ACCESS_TOKEN not set');
        return { Authorization: `Bearer ${token}` };
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map