"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
// Ng-Zorro Ant Design modules
var form_1 = require("ng-zorro-antd/form");
var button_1 = require("ng-zorro-antd/button");
var message_1 = require("ng-zorro-antd/message");
var alert_1 = require("ng-zorro-antd/alert");
var tabs_1 = require("ng-zorro-antd/tabs");
var grid_1 = require("ng-zorro-antd/grid");
var dropdown_1 = require("ng-zorro-antd/dropdown");
var icon_1 = require("ng-zorro-antd/icon");
var layout_1 = require("ng-zorro-antd/layout");
var tooltip_1 = require("ng-zorro-antd/tooltip");
var badge_1 = require("ng-zorro-antd/badge");
var list_1 = require("ng-zorro-antd/list");
var avatar_1 = require("ng-zorro-antd/avatar");
var tag_1 = require("ng-zorro-antd/tag");
var empty_1 = require("ng-zorro-antd/empty");
var menu_1 = require("ng-zorro-antd/menu");
var table_1 = require("ng-zorro-antd/table"); // Importación del módulo de tablas
var divider_1 = require("ng-zorro-antd/divider"); // Para divisores si se necesita
var card_1 = require("ng-zorro-antd/card");
var input_1 = require("ng-zorro-antd/input");
// import { registerAllModules } from 'handsontable/registry'; // Uncomment if needed
var SharedModule = function () {
    var _classDecorators = [(0, core_1.NgModule)({
            imports: [
                common_1.CommonModule,
                router_1.RouterModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                // Ng-Zorro Ant Design modules
                form_1.NzFormModule,
                input_1.NzInputModule,
                button_1.NzButtonModule,
                alert_1.NzAlertModule,
                tabs_1.NzTabsModule,
                grid_1.NzGridModule,
                dropdown_1.NzDropDownModule,
                icon_1.NzIconModule,
                layout_1.NzLayoutModule,
                tooltip_1.NzToolTipModule,
                badge_1.NzBadgeModule,
                list_1.NzListModule,
                avatar_1.NzAvatarModule,
                tag_1.NzTagModule,
                empty_1.NzEmptyModule,
                menu_1.NzMenuModule,
                table_1.NzTableModule, // Agregado para trabajar con tablas
                divider_1.NzDividerModule, // Agregado por si necesitas divisores
                card_1.NzCardModule,
            ],
            exports: [
                common_1.CommonModule,
                router_1.RouterModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                // Ng-Zorro Ant Design modules
                form_1.NzFormModule,
                input_1.NzInputModule,
                button_1.NzButtonModule,
                alert_1.NzAlertModule,
                tabs_1.NzTabsModule,
                grid_1.NzGridModule,
                dropdown_1.NzDropDownModule,
                icon_1.NzIconModule,
                layout_1.NzLayoutModule,
                tooltip_1.NzToolTipModule,
                badge_1.NzBadgeModule,
                list_1.NzListModule,
                avatar_1.NzAvatarModule,
                tag_1.NzTagModule,
                empty_1.NzEmptyModule,
                menu_1.NzMenuModule,
                table_1.NzTableModule, // Agregado para trabajar con tablas
                divider_1.NzDividerModule, // Agregado por si necesitas divisores
                card_1.NzCardModule,
            ],
            providers: [
                // Ng-Zorro Ant Design services
                message_1.NzMessageService,
            ]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SharedModule = _classThis = /** @class */ (function () {
        function SharedModule_1() {
        }
        return SharedModule_1;
    }());
    __setFunctionName(_classThis, "SharedModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SharedModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SharedModule = _classThis;
}();
exports.SharedModule = SharedModule;
