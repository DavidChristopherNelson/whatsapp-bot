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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const signature_guard_1 = require("../../common/guards/signature.guard");
let WebhookController = WebhookController_1 = class WebhookController {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(WebhookController_1.name);
    }
    verifyWebhook(mode, token, challenge, res) {
        const verifyToken = this.config.get('VERIFY_TOKEN');
        if (mode === 'subscribe' && token && token === verifyToken) {
            res.status(common_1.HttpStatus.OK).type('text/plain').send(challenge ?? '');
        }
        else {
            res.sendStatus(common_1.HttpStatus.FORBIDDEN);
        }
    }
    async handleWebhook(body, _sig) {
        const value = body?.entry?.[0]?.changes?.[0]?.value;
        if (value) {
            this.logger.log({ contacts: value.contacts?.[0]?.wa_id, messageType: value.messages?.[0]?.type, messageId: value.messages?.[0]?.id });
        }
        return { status: 'ok' };
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('hub.mode')),
    __param(1, (0, common_1.Query)('hub.verify_token')),
    __param(2, (0, common_1.Query)('hub.challenge')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "verifyWebhook", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(signature_guard_1.SignatureGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-hub-signature-256')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleWebhook", null);
exports.WebhookController = WebhookController = WebhookController_1 = __decorate([
    (0, common_1.Controller)('webhook'),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map