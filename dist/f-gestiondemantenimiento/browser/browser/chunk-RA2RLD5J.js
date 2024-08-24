import{A as j,B as G,C as q,Ja as X,Ka as Y,La as $,Ma as J,Na as K,Oa as Z,Pa as tt,Qa as et,Ra as nt,Sa as ot,Ta as it,X as B,Y as W,Z as H,ab as rt,eb as at,fb as st,ga as Q,gb as lt,h as k,ha as U,hb as mt,ib as ct,l as g,p as V,q as d,r as E,s as I,u as L,v as A,w as R}from"./chunk-MJ3ACMWH.js";import{$b as w,Eb as y,Gb as a,Ha as b,Ia as O,Sb as s,Tb as l,Ub as c,Yb as F,ac as S,dd as D,g as e,hc as z,ic as p,kd as M,mb as m,na as f,nb as v,qc as C,xa as u,xc as x,ya as h}from"./chunk-3SRQZBHN.js";function ut(n,t){n&1&&c(0,"nz-alert",15)}function ht(n,t){n&1&&c(0,"i",16)}function vt(n,t){n&1&&c(0,"i",17)}function zt(n,t){if(n&1){let _=F();s(0,"i",18),w("click",function(){b(_);let i=S();return O(i.togglePasswordVisibility())}),l()}if(n&2){let _=S();a("nzType",_.passwordVisible?"eye-invisible":"eye")}}var pt=(()=>{let t=class t{constructor(o,i,r){e(this,"fb");e(this,"router");e(this,"message");e(this,"validateForm");e(this,"isSpinning",!1);e(this,"loginError",!1);e(this,"selectedIndex",0);e(this,"mobileLoginError",!1);e(this,"passwordVisible",!1);e(this,"matchMobile",o=>o.value&&!o.value.match(/^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/)?{matchMobile:!0}:null);this.fb=o,this.router=i,this.message=r,this.validateForm=this.fb.group({username:["",[d.required]],password:["",[d.required]],mobile:["",[d.required,this.matchMobile]],mail:["",[d.required]],remember:[!0]})}ngOnInit(){}togglePasswordVisibility(){this.passwordVisible=!this.passwordVisible}selectedChange(o){if(o===0){let i=this.validateForm.controls.username.value,r=this.validateForm.controls.password.value;this.validateForm.controls.username.reset(i),this.validateForm.controls.password.reset(r)}else{let i=this.validateForm.controls.mobile.value,r=this.validateForm.controls.mail.value;this.validateForm.controls.mobile.reset(i),this.validateForm.controls.mail.reset(r)}}submitForm(){this.isSpinning=!0,this.loginError=!1;for(let o of["username","password"])o&&(this.validateForm.controls[o].markAsDirty(),this.validateForm.controls[o].updateValueAndValidity());if(this.validateForm.controls.username.invalid||this.validateForm.controls.password.invalid){this.isSpinning=!1;return}setTimeout(()=>{let o=this.validateForm.controls.username.value,i=this.validateForm.controls.password.value;["admin","user"].indexOf(o)!==-1&&i==="ng.antd.admin"?(this.router.navigate(["/"]),this.message.success("\u767B\u5F55\u6210\u529F")):(this.loginError=!0,this.isSpinning=!1)},1e3)}submitFormMobile(){this.isSpinning=!0,this.mobileLoginError=!1;for(let o of["mobile","mail"])o&&(this.validateForm.controls[o].markAsDirty(),this.validateForm.controls[o].updateValueAndValidity());if(this.validateForm.controls.mobile.invalid||this.validateForm.controls.mail.invalid){this.isSpinning=!1;return}this.login()}login(){setTimeout(()=>{this.validateForm.controls.mail.value==="123456"?(this.router.navigate(["/"]),this.message.success("\u767B\u5F55\u6210\u529F")):(this.mobileLoginError=!0,this.isSpinning=!1)},1e3)}goRegister(){this.router.navigate(["/user/register"])}};e(t,"\u0275fac",function(i){return new(i||t)(v(j),v(k),v(nt))}),e(t,"\u0275cmp",u({type:t,selectors:[["app-login-page"]],standalone:!0,features:[C],decls:25,vars:13,consts:[["userTpl",""],["lockTpl",""],["suffixTpl",""],["nz-form","",1,"login-form",3,"ngSubmit","formGroup"],["nzType","error","nzMessage","Cuenta o contrase\xF1a incorrecta (admin/ng.antd.admin)","nzShowIcon","","style","margin-bottom: 24px;",4,"ngIf"],["nzErrorTip","\xA1Por favor, ingrese el nombre de usuario!"],[3,"nzPrefix","nzSize"],["type","text","nz-input","","formControlName","username","placeholder","Usuario"],["nzErrorTip","\xA1Por favor, ingrese la contrase\xF1a!"],[3,"nzPrefix","nzSuffix","nzSize"],["nz-input","","formControlName","password","placeholder","Clave",3,"type"],["nz-row",""],["nz-col","",3,"nzSpan"],["nz-col","",1,"text-right",3,"nzSpan"],["nz-button","",1,"login",3,"nzType","nzSize","nzLoading"],["nzType","error","nzMessage","Cuenta o contrase\xF1a incorrecta (admin/ng.antd.admin)","nzShowIcon","",2,"margin-bottom","24px"],["nz-icon","","nzType","user","nzTheme","outline",2,"color","#1890ff"],["nz-icon","","nzType","lock","nzTheme","outline",2,"color","#1890ff"],["nz-icon","","nzTheme","outline",3,"click","nzType"]],template:function(i,r){if(i&1){let P=F();s(0,"form",3),w("ngSubmit",function(){return b(P),O(r.submitForm())}),y(1,ut,1,0,"nz-alert",4)(2,ht,1,0,"ng-template",null,0,x)(4,vt,1,0,"ng-template",null,1,x),s(6,"nz-form-item")(7,"nz-form-control",5)(8,"nz-input-group",6),c(9,"input",7),l()()(),s(10,"nz-form-item")(11,"nz-form-control",8)(12,"nz-input-group",9),c(13,"input",10),l(),y(14,zt,1,1,"ng-template",null,2,x),l()(),s(16,"div",11),c(17,"div",12),s(18,"div",13)(19,"a"),p(20,"\xBFOlvidaste tu contrase\xF1a?"),l()()(),s(21,"nz-form-item")(22,"nz-form-control")(23,"button",14),p(24,"Iniciar sesi\xF3n"),l()()()()}if(i&2){let P=z(3),N=z(5),ft=z(15);a("formGroup",r.validateForm),m(),a("ngIf",r.loginError),m(7),a("nzPrefix",P)("nzSize","large"),m(4),a("nzPrefix",N)("nzSuffix",ft)("nzSize","large"),m(),a("type",r.passwordVisible?"text":"password"),m(4),a("nzSpan",12),m(),a("nzSpan",12),m(5),a("nzType","primary")("nzSize","large")("nzLoading",r.isSpinning)}},dependencies:[M,D,G,L,V,E,I,q,A,R,rt,J,W,B,Y,X,$,ct,st,mt,lt,et,tt,K,Z,it,ot,at,H,U,Q],styles:[".container[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100vh;overflow:auto;background:#f0f2f5}@media (min-width: 768px){.container[_ngcontent-%COMP%]{background-image:url(https://llkui.github.io/ng-antd-admin/TVYTbAXWheQpRcWDaDMu.ebcb916068d431662f5b.svg);background-repeat:no-repeat;background-position:center 110px;background-size:100%}}.lang[_ngcontent-%COMP%]{width:100%;height:40px;line-height:44px;text-align:right}.lang[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{padding:12px;margin-right:24px}.content[_ngcontent-%COMP%]{padding:32px 0 24px;flex:1 1}.content[_ngcontent-%COMP%]   .top[_ngcontent-%COMP%]{text-align:center}.content[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{height:44px;margin-right:16px;vertical-align:top}.content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{position:relative;top:2px;color:#000000d9;font-weight:600;font-size:33px;font-family:Avenir,helvetica neue,Arial,Helvetica,sans-serif}.content[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]{margin-top:12px;margin-bottom:40px;color:#00000073;font-size:14px}.content[_ngcontent-%COMP%]   .main[_ngcontent-%COMP%]{width:368px;margin:0 auto}.content[_ngcontent-%COMP%]   .main[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-bottom:20px;font-size:16px}.content[_ngcontent-%COMP%]     .ant-tabs-nav-list{margin:auto}.content[_ngcontent-%COMP%]   .result-main[_ngcontent-%COMP%]{width:800px;min-height:400px;margin:auto;padding:80px}.content[_ngcontent-%COMP%]   .login[_ngcontent-%COMP%]{width:100%;margin-top:24px}.content[_ngcontent-%COMP%]   .ant-btn-link[_ngcontent-%COMP%]{padding-left:0;padding-right:0}.content[_ngcontent-%COMP%]   .login-other[_ngcontent-%COMP%]{margin-top:24px;line-height:22px;text-align:left;display:flex}.content[_ngcontent-%COMP%]   .login-other[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{margin-left:16px;font-size:24px;color:#00000073;vertical-align:middle;cursor:pointer;transition:color .3s}.content[_ngcontent-%COMP%]   .login-other[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:hover{color:#1890ff}.footer[_ngcontent-%COMP%]{margin:48px 0 24px;padding:0 16px;text-align:center}.footer[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]{margin-bottom:8px}.footer[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#00000073;transition:all .3s;margin-right:40px}.footer[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:last-child{margin-right:0}.footer[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#000000d9}.footer[_ngcontent-%COMP%]   .copyright[_ngcontent-%COMP%]{color:#00000073;font-size:14px}"]}));let n=t;return n})();var gt=(()=>{let t=class t{};e(t,"\u0275fac",function(i){return new(i||t)}),e(t,"\u0275cmp",u({type:t,selectors:[["app-forgot-password-page"]],standalone:!0,features:[C],decls:2,vars:0,template:function(i,r){i&1&&(s(0,"p"),p(1,"forgot-password-page works!"),l())}}));let n=t;return n})();var Ct=[{path:"login",component:pt},{path:"forgot-password",component:gt},{path:"**",redirectTo:"login"}],dt=(()=>{let t=class t{};e(t,"\u0275fac",function(i){return new(i||t)}),e(t,"\u0275mod",h({type:t})),e(t,"\u0275inj",f({imports:[g.forChild(Ct),g]}));let n=t;return n})();var re=(()=>{let t=class t{};e(t,"\u0275fac",function(i){return new(i||t)}),e(t,"\u0275mod",h({type:t})),e(t,"\u0275inj",f({imports:[M,g,dt]}));let n=t;return n})();export{re as AuthModule};
