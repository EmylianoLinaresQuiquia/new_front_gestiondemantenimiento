"use strict";(self.webpackChunkf_gestiondemantenimiento=self.webpackChunkf_gestiondemantenimiento||[]).push([[607],{5607:(V,u,i)=>{i.r(u),i.d(u,{AuthModule:()=>w});var c=i(177),s=i(6530),a=i(4341),l=i(8927),g=i(1011),f=i(513),h=i(3617),C=i(9541),m=i(7529),P=i(2602),z=i(9397),n=i(3953),M=i(7094),x=i(6389),O=i(5930);function F(t,p){1&t&&n.nrm(0,"nz-alert",15)}function b(t,p){1&t&&n.nrm(0,"i",16)}function _(t,p){1&t&&n.nrm(0,"i",17)}function y(t,p){if(1&t){const o=n.RV6();n.j41(0,"i",18),n.bIt("click",function(){n.eBV(o);const r=n.XpG();return n.Njj(r.togglePasswordVisibility())}),n.k0s()}if(2&t){const o=n.XpG();n.Y8G("nzType",o.passwordVisible?"eye-invisible":"eye")}}const T=[{path:"login",component:(()=>{class t{fb;router;message;validateForm;isSpinning=!1;loginError=!1;selectedIndex=0;mobileLoginError=!1;passwordVisible=!1;constructor(o,e,r){this.fb=o,this.router=e,this.message=r,this.validateForm=this.fb.group({username:["",[a.k0.required]],password:["",[a.k0.required]],mobile:["",[a.k0.required,this.matchMobile]],mail:["",[a.k0.required]],remember:[!0]})}ngOnInit(){}matchMobile=o=>o.value&&!o.value.match(/^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/)?{matchMobile:!0}:null;togglePasswordVisibility(){this.passwordVisible=!this.passwordVisible}selectedChange(o){if(0===o){const r=this.validateForm.controls.password.value;this.validateForm.controls.username.reset(this.validateForm.controls.username.value),this.validateForm.controls.password.reset(r)}else{const r=this.validateForm.controls.mail.value;this.validateForm.controls.mobile.reset(this.validateForm.controls.mobile.value),this.validateForm.controls.mail.reset(r)}}submitForm(){this.isSpinning=!0,this.loginError=!1;for(const o of["username","password"])o&&(this.validateForm.controls[o].markAsDirty(),this.validateForm.controls[o].updateValueAndValidity());this.validateForm.controls.username.invalid||this.validateForm.controls.password.invalid?this.isSpinning=!1:setTimeout(()=>{const e=this.validateForm.controls.password.value;-1!==["admin","user"].indexOf(this.validateForm.controls.username.value)&&"ng.antd.admin"===e?(this.router.navigate(["/"]),this.message.success("\u767b\u5f55\u6210\u529f")):(this.loginError=!0,this.isSpinning=!1)},1e3)}submitFormMobile(){this.isSpinning=!0,this.mobileLoginError=!1;for(const o of["mobile","mail"])o&&(this.validateForm.controls[o].markAsDirty(),this.validateForm.controls[o].updateValueAndValidity());this.validateForm.controls.mobile.invalid||this.validateForm.controls.mail.invalid?this.isSpinning=!1:this.login()}login(){setTimeout(()=>{"123456"===this.validateForm.controls.mail.value?(this.router.navigate(["/"]),this.message.success("\u767b\u5f55\u6210\u529f")):(this.mobileLoginError=!0,this.isSpinning=!1)},1e3)}goRegister(){this.router.navigate(["/user/register"])}static \u0275fac=function(e){return new(e||t)(n.rXU(a.ok),n.rXU(s.Ix),n.rXU(M.xh))};static \u0275cmp=n.VBU({type:t,selectors:[["app-login-page"]],standalone:!0,features:[n.aNF],decls:25,vars:13,consts:[["userTpl",""],["lockTpl",""],["suffixTpl",""],["nz-form","",1,"login-form",3,"ngSubmit","formGroup"],["nzType","error","nzMessage","Cuenta o contrase\xf1a incorrecta (admin/ng.antd.admin)","nzShowIcon","","style","margin-bottom: 24px;",4,"ngIf"],["nzErrorTip","\xa1Por favor, ingrese el nombre de usuario!"],[3,"nzPrefix","nzSize"],["type","text","nz-input","","formControlName","username","placeholder","Usuario"],["nzErrorTip","\xa1Por favor, ingrese la contrase\xf1a!"],[3,"nzPrefix","nzSuffix","nzSize"],["nz-input","","formControlName","password","placeholder","Clave",3,"type"],["nz-row",""],["nz-col","",3,"nzSpan"],["nz-col","",1,"text-right",3,"nzSpan"],["nz-button","",1,"login",3,"nzType","nzSize","nzLoading"],["nzType","error","nzMessage","Cuenta o contrase\xf1a incorrecta (admin/ng.antd.admin)","nzShowIcon","",2,"margin-bottom","24px"],["nz-icon","","nzType","user","nzTheme","outline",2,"color","#1890ff"],["nz-icon","","nzType","lock","nzTheme","outline",2,"color","#1890ff"],["nz-icon","","nzTheme","outline",3,"click","nzType"]],template:function(e,r){if(1&e){const d=n.RV6();n.j41(0,"form",3),n.bIt("ngSubmit",function(){return n.eBV(d),n.Njj(r.submitForm())}),n.DNE(1,F,1,0,"nz-alert",4)(2,b,1,0,"ng-template",null,0,n.C5r)(4,_,1,0,"ng-template",null,1,n.C5r),n.j41(6,"nz-form-item")(7,"nz-form-control",5)(8,"nz-input-group",6),n.nrm(9,"input",7),n.k0s()()(),n.j41(10,"nz-form-item")(11,"nz-form-control",8)(12,"nz-input-group",9),n.nrm(13,"input",10),n.k0s(),n.DNE(14,y,1,1,"ng-template",null,2,n.C5r),n.k0s()(),n.j41(16,"div",11),n.nrm(17,"div",12),n.j41(18,"div",13)(19,"a"),n.EFF(20,"\xbfOlvidaste tu contrase\xf1a?"),n.k0s()()(),n.j41(21,"nz-form-item")(22,"nz-form-control")(23,"button",14),n.EFF(24,"Iniciar sesi\xf3n"),n.k0s()()()()}if(2&e){const d=n.sdS(3),v=n.sdS(5),k=n.sdS(15);n.Y8G("formGroup",r.validateForm),n.R7$(),n.Y8G("ngIf",r.loginError),n.R7$(7),n.Y8G("nzPrefix",d)("nzSize","large"),n.R7$(4),n.Y8G("nzPrefix",v)("nzSuffix",k)("nzSize","large"),n.R7$(),n.Y8G("type",r.passwordVisible?"text":"password"),n.R7$(4),n.Y8G("nzSpan",12),n.R7$(),n.Y8G("nzSpan",12),n.R7$(5),n.Y8G("nzType","primary")("nzSize","large")("nzLoading",r.isSpinning)}},dependencies:[c.MD,c.bT,a.YN,a.qT,a.me,a.BC,a.cb,a.X1,a.j4,a.JD,P.Cu,l.PQ,m.Uq,m.e,l.CA,l.Ls,l.zS,g.j,g.Sy,g.tg,g.vN,f.Zw,f.aO,x.c,O.p,h.$,h.Y,C.hM,m.f3,z.Y3,z.Dn],styles:[".container[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100vh;overflow:auto;background:#f0f2f5}@media (min-width: 768px){.container[_ngcontent-%COMP%]{background-image:url(https://llkui.github.io/ng-antd-admin/TVYTbAXWheQpRcWDaDMu.ebcb916068d431662f5b.svg);background-repeat:no-repeat;background-position:center 110px;background-size:100%}}.lang[_ngcontent-%COMP%]{width:100%;height:40px;line-height:44px;text-align:right}.lang[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{padding:12px;margin-right:24px}.content[_ngcontent-%COMP%]{padding:32px 0 24px;flex:1 1}.content[_ngcontent-%COMP%]   .top[_ngcontent-%COMP%]{text-align:center}.content[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{height:44px;margin-right:16px;vertical-align:top}.content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{position:relative;top:2px;color:#000000d9;font-weight:600;font-size:33px;font-family:Avenir,helvetica neue,Arial,Helvetica,sans-serif}.content[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]{margin-top:12px;margin-bottom:40px;color:#00000073;font-size:14px}.content[_ngcontent-%COMP%]   .main[_ngcontent-%COMP%]{width:368px;margin:0 auto}.content[_ngcontent-%COMP%]   .main[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-bottom:20px;font-size:16px}.content[_ngcontent-%COMP%]     .ant-tabs-nav-list{margin:auto}.content[_ngcontent-%COMP%]   .result-main[_ngcontent-%COMP%]{width:800px;min-height:400px;margin:auto;padding:80px}.content[_ngcontent-%COMP%]   .login[_ngcontent-%COMP%]{width:100%;margin-top:24px}.content[_ngcontent-%COMP%]   .ant-btn-link[_ngcontent-%COMP%]{padding-left:0;padding-right:0}.content[_ngcontent-%COMP%]   .login-other[_ngcontent-%COMP%]{margin-top:24px;line-height:22px;text-align:left;display:flex}.content[_ngcontent-%COMP%]   .login-other[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{margin-left:16px;font-size:24px;color:#00000073;vertical-align:middle;cursor:pointer;transition:color .3s}.content[_ngcontent-%COMP%]   .login-other[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:hover{color:#1890ff}.footer[_ngcontent-%COMP%]{margin:48px 0 24px;padding:0 16px;text-align:center}.footer[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]{margin-bottom:8px}.footer[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#00000073;transition:all .3s;margin-right:40px}.footer[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:last-child{margin-right:0}.footer[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#000000d9}.footer[_ngcontent-%COMP%]   .copyright[_ngcontent-%COMP%]{color:#00000073;font-size:14px}"]})}return t})()},{path:"forgot-password",component:(()=>{class t{static \u0275fac=function(e){return new(e||t)};static \u0275cmp=n.VBU({type:t,selectors:[["app-forgot-password-page"]],standalone:!0,features:[n.aNF],decls:2,vars:0,template:function(e,r){1&e&&(n.j41(0,"p"),n.EFF(1,"forgot-password-page works!"),n.k0s())}})}return t})()},{path:"**",redirectTo:"login"}];let S=(()=>{class t{static \u0275fac=function(e){return new(e||t)};static \u0275mod=n.$C({type:t});static \u0275inj=n.G2t({imports:[s.iI.forChild(T),s.iI]})}return t})(),w=(()=>{class t{static \u0275fac=function(e){return new(e||t)};static \u0275mod=n.$C({type:t});static \u0275inj=n.G2t({imports:[c.MD,s.iI,S]})}return t})()}}]);