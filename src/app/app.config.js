"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var app_routes_1 = require("./app.routes");
var platform_browser_1 = require("@angular/platform-browser");
var i18n_1 = require("ng-zorro-antd/i18n");
var common_1 = require("@angular/common");
var ca_1 = require("@angular/common/locales/ca");
var forms_1 = require("@angular/forms");
var async_1 = require("@angular/platform-browser/animations/async");
var http_1 = require("@angular/common/http");
(0, common_1.registerLocaleData)(ca_1.default);
exports.appConfig = {
    providers: [(0, core_1.provideZoneChangeDetection)({ eventCoalescing: true }), (0, router_1.provideRouter)(app_routes_1.routes), (0, platform_browser_1.provideClientHydration)(), (0, i18n_1.provideNzI18n)(i18n_1.ca_ES), (0, core_1.importProvidersFrom)(forms_1.FormsModule), (0, async_1.provideAnimationsAsync)(), (0, http_1.provideHttpClient)()]
};
