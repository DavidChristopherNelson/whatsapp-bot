"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    WA_ACCESS_TOKEN: zod_1.z.string().min(1),
    WA_WABA_ID: zod_1.z.string().min(1),
    WA_PHONE_NUMBER_ID: zod_1.z.string().min(1),
    WA_API_VERSION: zod_1.z.string().min(1),
    VERIFY_TOKEN: zod_1.z.string().min(1),
    APP_SECRET: zod_1.z.string().optional(),
    PLATFORM_BASE_URL: zod_1.z.string().url(),
    PLATFORM_WHATSAPP_ENDPOINT: zod_1.z.string().min(1),
    WA_PLEASE_VOICE_MEDIA_ID: zod_1.z.string().optional(),
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
});
//# sourceMappingURL=config.schema.js.map