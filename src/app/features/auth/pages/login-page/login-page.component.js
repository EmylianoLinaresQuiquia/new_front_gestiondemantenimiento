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
exports.LoginPageComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var forms_2 = require("@angular/forms");
// Importación de los módulos de Ng-Zorro-Antd
var form_1 = require("ng-zorro-antd/form");
var input_1 = require("ng-zorro-antd/input");
var button_1 = require("ng-zorro-antd/button");
var alert_1 = require("ng-zorro-antd/alert");
var tabs_1 = require("ng-zorro-antd/tabs");
var grid_1 = require("ng-zorro-antd/grid");
var dropdown_1 = require("ng-zorro-antd/dropdown");
var icon_1 = require("ng-zorro-antd/icon");
var LoginPageComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-login-page',
            standalone: true,
            imports: [
                common_1.CommonModule, forms_2.FormsModule, forms_2.ReactiveFormsModule, dropdown_1.NzDropDownModule, form_1.NzFormModule, input_1.NzInputModule, button_1.NzButtonModule, alert_1.NzAlertModule, tabs_1.NzTabsModule, grid_1.NzGridModule,
                icon_1.NzIconModule
            ],
            templateUrl: './login-page.component.html',
            styleUrls: ['./login-page.component.css'] // Corregido 'styleUrl' a 'styleUrls'
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LoginPageComponent = _classThis = /** @class */ (function () {
        function LoginPageComponent_1(fb, router, message) {
            this.fb = fb;
            this.router = router;
            this.message = message;
            this.isSpinning = false;
            this.loginError = false;
            this.selectedIndex = 0;
            this.mobileLoginError = false;
            this.passwordVisible = false;
            this.matchMobile = function (control) {
                if (control.value && !control.value.match(/^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/)) {
                    return { matchMobile: true };
                }
                return null;
            };
            this.validateForm = this.fb.group({
                username: ['', [forms_1.Validators.required]],
                password: ['', [forms_1.Validators.required]],
                mobile: ['', [forms_1.Validators.required, this.matchMobile]],
                mail: ['', [forms_1.Validators.required]],
                remember: [true]
            });
        }
        LoginPageComponent_1.prototype.ngOnInit = function () { };
        LoginPageComponent_1.prototype.togglePasswordVisibility = function () {
            this.passwordVisible = !this.passwordVisible;
        };
        LoginPageComponent_1.prototype.selectedChange = function ($event) {
            if ($event === 0) {
                var username = this.validateForm.controls['username'].value;
                var password = this.validateForm.controls['password'].value;
                this.validateForm.controls['username'].reset(username);
                this.validateForm.controls['password'].reset(password);
            }
            else {
                var mobile = this.validateForm.controls['mobile'].value;
                var mail = this.validateForm.controls['mail'].value;
                this.validateForm.controls['mobile'].reset(mobile);
                this.validateForm.controls['mail'].reset(mail);
            }
        };
        LoginPageComponent_1.prototype.submitForm = function () {
            var _this = this;
            this.isSpinning = true;
            this.loginError = false;
            for (var _i = 0, _a = ['username', 'password']; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i) {
                    this.validateForm.controls[i].markAsDirty();
                    this.validateForm.controls[i].updateValueAndValidity();
                }
            }
            if (this.validateForm.controls['username'].invalid || this.validateForm.controls['password'].invalid) {
                this.isSpinning = false;
                return;
            }
            setTimeout(function () {
                var username = _this.validateForm.controls['username'].value;
                var password = _this.validateForm.controls['password'].value;
                if (['admin', 'user'].indexOf(username) !== -1 && 'ng.antd.admin' === password) {
                    _this.router.navigate(['/']);
                    _this.message.success('登录成功');
                }
                else {
                    _this.loginError = true;
                    _this.isSpinning = false;
                }
            }, 1000);
        };
        LoginPageComponent_1.prototype.submitFormMobile = function () {
            this.isSpinning = true;
            this.mobileLoginError = false;
            for (var _i = 0, _a = ['mobile', 'mail']; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i) {
                    this.validateForm.controls[i].markAsDirty();
                    this.validateForm.controls[i].updateValueAndValidity();
                }
            }
            if (this.validateForm.controls['mobile'].invalid || this.validateForm.controls['mail'].invalid) {
                this.isSpinning = false;
                return;
            }
            this.login();
        };
        LoginPageComponent_1.prototype.login = function () {
            var _this = this;
            setTimeout(function () {
                var mail = _this.validateForm.controls['mail'].value;
                if (mail === '123456') {
                    _this.router.navigate(['/']);
                    _this.message.success('登录成功');
                }
                else {
                    _this.mobileLoginError = true;
                    _this.isSpinning = false;
                }
            }, 1000);
        };
        LoginPageComponent_1.prototype.goRegister = function () {
            this.router.navigate(['/user/register']);
        };
        return LoginPageComponent_1;
    }());
    __setFunctionName(_classThis, "LoginPageComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoginPageComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoginPageComponent = _classThis;
}();
exports.LoginPageComponent = LoginPageComponent;
