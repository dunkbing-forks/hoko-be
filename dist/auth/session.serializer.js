"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSerializer = void 0;
const passport_1 = require("@nestjs/passport");
class SessionSerializer extends passport_1.PassportSerializer {
    serializeUser(user, done) {
        done(null, user);
    }
    deserializeUser(payload, done) {
        done(null, payload);
    }
}
exports.SessionSerializer = SessionSerializer;
//# sourceMappingURL=session.serializer.js.map