/**
 * @license
 * Lo-Dash 1.2.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modern -o ./dist/lodash.js`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.4.4 <http://underscorejs.org/>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
 * Available under MIT license <http://lodash.com/license>
 */

(function(e){function H(n){function yt(e){return e&&typeof e=="object"&&!_t(e)&&et.call(e,"__wrapped__")?e:new Ct(e)}function wt(e){var t=e.length,n=t>=a;if(n){var r={},i=-1;while(++i<t){var s=u+e[i];(r[s]||(r[s]=[])).push(e[i])}}return function(t){if(n){var i=u+t;return r[i]&&Rn(r[i],t)>-1}return Rn(e,t)>-1}}function Et(e){return e.charCodeAt(0)}function St(e,t){var n=e.index,r=t.index;e=e.criteria,t=t.criteria;if(e!==t){if(e>t||typeof e=="undefined")return 1;if(e<t||typeof t=="undefined")return-1}return n<r?-1:1}function xt(e,t,n,r){function a(){var r=arguments,f=s?this:t;i||(e=t[o]),n.length&&(r=r.length?(r=dt.call(r),u?r.concat(n):n.concat(r)):n);if(this instanceof a){kt.prototype=e.prototype,f=new kt,kt.prototype=null;var l=e.apply(f,r);return en(l)?l:f}return e.apply(f,r)}var i=Zt(e),s=!n,o=t;if(s){var u=r;n=t}else if(!i){if(!r)throw new W;t=e}return a}function Tt(e){return"\\"+P[e]}function Nt(e){return Ht[e]}function Ct(e){this.__wrapped__=e}function kt(){}function Lt(e){var t=!1;if(!e||it.call(e)!=A)return t;var n=e.constructor;return(Zt(n)?n instanceof n:!0)?(Ut(e,function(e,n){t=n}),t===!1||et.call(e,t)):t}function At(e,t,n){t||(t=0),typeof n=="undefined"&&(n=e?e.length:0);var r=-1,s=n-t||0,o=i(s<0?0:s);while(++r<s)o[r]=e[t+r];return o}function Ot(e){return Bt[e]}function Mt(e){return it.call(e)==x}function Ft(e,n,r,i,s,o){var u=e;typeof n=="function"&&(i=r,r=n,n=!1);if(typeof r=="function"){r=typeof i=="undefined"?r:yt.createCallback(r,i,1),u=r(u);if(typeof u!="undefined")return u;u=e}var a=en(u);if(a){var f=it.call(u);if(!_[f])return u;var l=_t(u)}if(!a||!n)return a?l?At(u):jt({},u):u;var c=gt[f];switch(f){case N:case C:return new c(+u);case L:case M:return new c(u);case O:return c(u.source,d.exec(u))}s||(s=[]),o||(o=[]);var h=s.length;while(h--)if(s[h]==e)return o[h];return u=l?c(u.length):{},l&&(et.call(e,"index")&&(u.index=e.index),et.call(e,"input")&&(u.input=e.input)),s.push(e),o.push(u),(l?wn:zt)(e,function(e,i){u[i]=Ft(e,n,r,t,s,o)}),u}function It(e,t,n){return Ft(e,!0,t,n)}function Rt(e,t,n){var r;return t=yt.createCallback(t,n),zt(e,function(e,n,i){if(t(e,n,i))return r=n,!1}),r}function Wt(e){var t=[];return Ut(e,function(e,n){Zt(e)&&t.push(n)}),t.sort()}function Xt(e,t){return e?et.call(e,t):!1}function Vt(e){var t=-1,n=Pt(e),r=n.length,i={};while(++t<r){var s=n[t];i[e[s]]=s}return i}function $t(e){return e===!0||e===!1||it.call(e)==N}function Jt(e){return e?typeof e=="object"&&it.call(e)==C:!1}function Kt(e){return e?e.nodeType===1:!1}function Qt(e){var t=!0;if(!e)return t;var n=it.call(e),r=e.length;return n==T||n==M||n==x||n==A&&typeof r=="number"&&Zt(e.splice)?!r:(zt(e,function(){return t=!1}),t)}function Gt(e,t,n,r,i,s){var u=n===o;if(typeof n=="function"&&!u){n=yt.createCallback(n,r,2);var a=n(e,t);if(typeof a!="undefined")return!!a}if(e===t)return e!==0||1/e==1/t;var f=typeof e,l=typeof t;if(e===e&&(!e||f!="function"&&f!="object")&&(!t||l!="function"&&l!="object"))return!1;if(e==null||t==null)return e===t;var c=it.call(e),h=it.call(t);c==x&&(c=A),h==x&&(h=A);if(c!=h)return!1;switch(c){case N:case C:return+e==+t;case L:return e!=+e?t!=+t:e==0?1/e==1/t:e==+t;case O:case M:return e==z(t)}var p=c==T;if(!p){if(et.call(e,"__wrapped__ ")||et.call(t,"__wrapped__"))return Gt(e.__wrapped__||e,t.__wrapped__||t,n,r,i,s);if(c!=A)return!1;var d=e.constructor,v=t.constructor;if(d!=v&&!(Zt(d)&&d instanceof d&&Zt(v)&&v instanceof v))return!1}i||(i=[]),s||(s=[]);var m=i.length;while(m--)if(i[m]==e)return s[m]==t;var g=0;a=!0,i.push(e),s.push(t);if(p){m=e.length,g=t.length,a=g==e.length;if(!a&&!u)return a;while(g--){var y=m,b=t[g];if(u){while(y--)if(a=Gt(e[y],b,n,r,i,s))break}else if(!(a=Gt(e[g],b,n,r,i,s)))break}return a}return Ut(t,function(t,o,u){if(et.call(u,o))return g++,a=et.call(e,o)&&Gt(e[o],t,n,r,i,s)}),a&&!u&&Ut(e,function(e,t,n){if(et.call(n,t))return a=--g>-1}),a}function Yt(e){return ut(e)&&!at(parseFloat(e))}function Zt(e){return typeof e=="function"}function en(e){return e?D[typeof e]:!1}function tn(e){return rn(e)&&e!=+e}function nn(e){return e===null}function rn(e){return typeof e=="number"||it.call(e)==L}function on(e){return e?typeof e=="object"&&it.call(e)==O:!1}function un(e){return typeof e=="string"||it.call(e)==M}function an(e){return typeof e=="undefined"}function fn(e,t,n){var r=arguments,i=0,s=2;if(!en(e))return e;if(n===o)var u=r[3],a=r[4],f=r[5];else a=[],f=[],typeof n!="number"&&(s=r.length),s>3&&typeof r[s-2]=="function"?u=yt.createCallback(r[--s-1],r[s--],2):s>2&&typeof r[s-1]=="function"&&(u=r[--s]);while(++i<s)(_t(r[i])?wn:zt)(r[i],function(t,n){var r,i,s=t,l=e[n];if(t&&((i=_t(t))||sn(t))){var c=a.length;while(c--)if(r=a[c]==t){l=f[c];break}if(!r){var h;if(u){s=u(l,t);if(h=typeof s!="undefined")l=s}h||(l=i?_t(l)?l:[]:sn(l)?l:{}),a.push(t),f.push(l),h||(l=fn(l,t,o,u,a,f))}}else u&&(s=u(l,t),typeof s=="undefined"&&(s=t)),typeof s!="undefined"&&(l=s);e[n]=l});return e}function ln(e,t,n){var r=typeof t=="function",i={};if(r)t=yt.createCallback(t,n);else var s=G.apply(X,dt.call(arguments,1));return Ut(e,function(e,n,o){if(r?!t(e,n,o):Rn(s,n)<0)i[n]=e}),i}function cn(e){var t=-1,n=Pt(e),r=n.length,s=i(r);while(++t<r){var o=n[t];s[t]=[o,e[o]]}return s}function hn(e,t,n){var r={};if(typeof t!="function"){var i=-1,s=G.apply(X,dt.call(arguments,1)),o=en(e)?s.length:0;while(++i<o){var u=s[i];u in e&&(r[u]=e[u])}}else t=yt.createCallback(t,n),Ut(e,function(e,n,i){t(e,n,i)&&(r[n]=e)});return r}function pn(e){var t=-1,n=Pt(e),r=n.length,s=i(r);while(++t<r)s[t]=e[n[t]];return s}function dn(e){var t=-1,n=G.apply(X,dt.call(arguments,1)),r=n.length,s=i(r);while(++t<r)s[t]=e[n[t]];return s}function vn(e,t,n){var r=-1,i=e?e.length:0,s=!1;return n=(n<0?lt(0,i+n):n)||0,typeof i=="number"?s=(un(e)?e.indexOf(t,n):Rn(e,t,n))>-1:zt(e,function(e){if(++r>=n)return!(s=e===t)}),s}function mn(e,t,n){var r={};return t=yt.createCallback(t,n),wn(e,function(e,n,i){n=z(t(e,n,i)),et.call(r,n)?r[n]++:r[n]=1}),r}function gn(e,t,n){var r=!0;t=yt.createCallback(t,n);var i=-1,s=e?e.length:0;if(typeof s=="number"){while(++i<s)if(!(r=!!t(e[i],i,e)))break}else zt(e,function(e,n,i){return r=!!t(e,n,i)});return r}function yn(e,t,n){var r=[];t=yt.createCallback(t,n);var i=-1,s=e?e.length:0;if(typeof s=="number")while(++i<s){var o=e[i];t(o,i,e)&&r.push(o)}else zt(e,function(e,n,i){t(e,n,i)&&r.push(e)});return r}function bn(e,t,n){t=yt.createCallback(t,n);var r=-1,i=e?e.length:0;if(typeof i!="number"){var o;return zt(e,function(e,n,r){if(t(e,n,r))return o=e,!1}),o}while(++r<i){var s=e[r];if(t(s,r,e))return s}}function wn(e,t,n){var r=-1,i=e?e.length:0;t=t&&typeof n=="undefined"?t:yt.createCallback(t,n);if(typeof i=="number"){while(++r<i)if(t(e[r],r,e)===!1)break}else zt(e,t);return e}function En(e,t,n){var r={};return t=yt.createCallback(t,n),wn(e,function(e,n,i){n=z(t(e,n,i)),(et.call(r,n)?r[n]:r[n]=[]).push(e)}),r}function Sn(e,t){var n=dt.call(arguments,2),r=-1,s=typeof t=="function",o=e?e.length:0,u=i(typeof o=="number"?o:0);return wn(e,function(e){u[++r]=(s?t:e[t]).apply(e,n)}),u}function xn(e,t,n){var r=-1,s=e?e.length:0;t=yt.createCallback(t,n);if(typeof s=="number"){var o=i(s);while(++r<s)o[r]=t(e[r],r,e)}else o=[],zt(e,function(e,n,i){o[++r]=t(e,n,i)});return o}function Tn(e,t,n){var r=-Infinity,i=r;if(!t&&_t(e)){var s=-1,o=e.length;while(++s<o){var u=e[s];u>i&&(i=u)}}else t=!t&&un(e)?Et:yt.createCallback(t,n),wn(e,function(e,n,s){var o=t(e,n,s);o>r&&(r=o,i=e)});return i}function Nn(e,t,n){var r=Infinity,i=r;if(!t&&_t(e)){var s=-1,o=e.length;while(++s<o){var u=e[s];u<i&&(i=u)}}else t=!t&&un(e)?Et:yt.createCallback(t,n),wn(e,function(e,n,s){var o=t(e,n,s);o<r&&(r=o,i=e)});return i}function Cn(e,t){var n=-1,r=e?e.length:0;if(typeof r=="number"){var s=i(r);while(++n<r)s[n]=e[n][t]}return s||xn(e,t)}function kn(e,t,n,r){if(!e)return n;var i=arguments.length<3;t=yt.createCallback(t,r,4);var s=-1,o=e.length;if(typeof o=="number"){i&&(n=e[++s]);while(++s<o)n=t(n,e[s],s,e)}else zt(e,function(e,r,s){n=i?(i=!1,e):t(n,e,r,s)});return n}function Ln(e,t,n,r){var i=e,s=e?e.length:0,o=arguments.length<3;if(typeof s!="number"){var u=Pt(e);s=u.length}return t=yt.createCallback(t,r,4),wn(e,function(e,r,a){r=u?u[--s]:--s,n=o?(o=!1,i[r]):t(n,i[r],r,a)}),n}function An(e,t,n){return t=yt.createCallback(t,n),yn(e,function(e,n,r){return!t(e,n,r)})}function On(e){var t=-1,n=e?e.length:0,r=i(typeof n=="number"?n:0);return wn(e,function(e){var n=Y(pt()*(++t+1));r[t]=r[n],r[n]=e}),r}function Mn(e){var t=e?e.length:0;return typeof t=="number"?t:Pt(e).length}function _n(e,t,n){var r;t=yt.createCallback(t,n);var i=-1,s=e?e.length:0;if(typeof s=="number"){while(++i<s)if(r=t(e[i],i,e))break}else zt(e,function(e,n,i){return!(r=t(e,n,i))});return!!r}function Dn(e,t,n){var r=-1,s=e?e.length:0,o=i(typeof s=="number"?s:0);t=yt.createCallback(t,n),wn(e,function(e,n,i){o[++r]={criteria:t(e,n,i),index:r,value:e}}),s=o.length,o.sort(St);while(s--)o[s]=o[s].value;return o}function Pn(e){return e&&typeof e.length=="number"?At(e):pn(e)}function Bn(e){var t=-1,n=e?e.length:0,r=[];while(++t<n){var i=e[t];i&&r.push(i)}return r}function jn(e){var t=-1,n=e?e.length:0,r=G.apply(X,dt.call(arguments,1)),i=wt(r),s=[];while(++t<n){var o=e[t];i(o)||s.push(o)}return s}function Fn(e,t,n){var r=-1,i=e?e.length:0;t=yt.createCallback(t,n);while(++r<i)if(t(e[r],r,e))return r;return-1}function In(e,t,n){if(e){var r=0,i=e.length;if(typeof t!="number"&&t!=null){var s=-1;t=yt.createCallback(t,n);while(++s<i&&t(e[s],s,e))r++}else{r=t;if(r==null||n)return e[0]}return At(e,0,ct(lt(0,r),i))}}function qn(e,t,n,r){var i=-1,s=e?e.length:0,o=[];typeof t!="boolean"&&t!=null&&(r=n,n=t,t=!1),n!=null&&(n=yt.createCallback(n,r));while(++i<s){var u=e[i];n&&(u=n(u,i,e)),_t(u)?tt.apply(o,t?u:qn(u)):o.push(u)}return o}function Rn(e,t,n){var r=-1,i=e?e.length:0;if(typeof n=="number")r=(n<0?lt(0,i+n):n||0)-1;else if(n)return r=Jn(e,t),e[r]===t?r:-1;while(++r<i)if(e[r]===t)return r;return-1}function Un(e,t,n){if(!e)return[];var r=0,i=e.length;if(typeof t!="number"&&t!=null){var s=i;t=yt.createCallback(t,n);while(s--&&t(e[s],s,e))r++}else r=t==null||n?1:t||r;return At(e,0,ct(lt(0,i-r),i))}function zn(e){var t=arguments,n=t.length,r={0:{}},i=-1,s=e?e.length:0,o=s>=a,f=[],l=f;e:while(++i<s){var c=e[i];if(o)var h=u+c,p=r[0][h]?!(l=r[0][h]):l=r[0][h]=[];if(p||Rn(l,c)<0){o&&l.push(c);var d=n;while(--d)if(!(r[d]||(r[d]=wt(t[d])))(c))continue e;f.push(c)}}return f}function Wn(e,t,n){if(e){var r=0,i=e.length;if(typeof t!="number"&&t!=null){var s=i;t=yt.createCallback(t,n);while(s--&&t(e[s],s,e))r++}else{r=t;if(r==null||n)return e[i-1]}return At(e,lt(0,i-r))}}function Xn(e,t,n){var r=e?e.length:0;typeof n=="number"&&(r=(n<0?lt(0,r+n):ct(n,r-1))+1);while(r--)if(e[r]===t)return r;return-1}function Vn(e,t,n){e=+e||0,n=+n||1,t==null&&(t=e,e=0);var r=-1,s=lt(0,K((t-e)/n)),o=i(s);while(++r<s)o[r]=e,e+=n;return o}function $n(e,t,n){if(typeof t!="number"&&t!=null){var r=0,i=-1,s=e?e.length:0;t=yt.createCallback(t,n);while(++i<s&&t(e[i],i,e))r++}else r=t==null||n?1:lt(0,t);return At(e,r)}function Jn(e,t,n,r){var i=0,s=e?e.length:i;n=n?yt.createCallback(n,r,1):gr,t=n(t);while(i<s){var o=i+s>>>1;n(e[o])<t?i=o+1:s=o}return i}function Kn(e){return _t(e)||(arguments[0]=e?dt.call(e):X),Qn(G.apply(X,arguments))}function Qn(e,t,n,r){var i=-1,s=e?e.length:0,o=[],f=o;typeof t!="boolean"&&t!=null&&(r=n,n=t,t=!1);var l=!t&&s>=a;if(l)var c={};n!=null&&(f=[],n=yt.createCallback(n,r));while(++i<s){var h=e[i],p=n?n(h,i,e):h;if(l)var d=u+p,v=c[d]?!(f=c[d]):f=c[d]=[];if(t?!i||f[f.length-1]!==p:v||Rn(f,p)<0)(n||l)&&f.push(p),o.push(h)}return o}function Gn(e){var t=-1,n=e?e.length:0,r=n?Tn(Cn(e,"length")):0,s=i(r);while(++t<n){var o=-1,u=e[t];while(++o<r)(s[o]||(s[o]=i(n)))[t]=u[o]}return s}function Yn(e){return jn(e,dt.call(arguments,1))}function Zn(e){var t=-1,n=e?Tn(Cn(arguments,"length")):0,r=i(n);while(++t<n)r[t]=Cn(arguments,t);return r}function er(e,t){var n=-1,r=e?e.length:0,i={};while(++n<r){var s=e[n];t?i[s]=t[n]:i[s[0]]=s[1]}return i}function tr(e,t){return e<1?t():function(){if(--e<1)return t.apply(this,arguments)}}function nr(e,t){return bt.fastBind||st&&arguments.length>2?st.call.apply(st,arguments):xt(e,t,dt.call(arguments,2))}function rr(e){var t=arguments.length>1?G.apply(X,dt.call(arguments,1)):Wt(e),n=-1,r=t.length;while(++n<r){var i=t[n];e[i]=nr(e[i],e)}return e}function ir(e,t){return xt(e,t,dt.call(arguments,2),o)}function sr(){var e=arguments;return function(){var t=arguments,n=e.length;while(n--)t=[e[n].apply(this,t)];return t[0]}}function or(e,t,n){if(e==null)return gr;var r=typeof e;if(r!="function"){if(r!="object")return function(t){return t[e]};var i=Pt(e);return function(t){var n=i.length,r=!1;while(n--)if(!(r=Gt(t[i[n]],e[i[n]],o)))break;return r}}return typeof t!="undefined"?n===1?function(n){return e.call(t,n)}:n===2?function(n,r){return e.call(t,n,r)}:n===4?function(n,r,i,s){return e.call(t,n,r,i,s)}:function(n,r,i){return e.call(t,n,r,i)}:e}function ur(e,t,n){function f(){i=u=null,a&&(s=e.apply(o,r))}var r,i,s,o,u,a=!0;if(n===!0){var l=!0;a=!1}else n&&D[typeof n]&&(l=n.leading,a="trailing"in n?n.trailing:a);return function(){return r=arguments,o=this,Q(u),!i&&l?(i=!0,s=e.apply(o,r)):u=rt(f,t),s}}function ar(e){var n=dt.call(arguments,1);return rt(function(){e.apply(t,n)},1)}function fr(e,n){var r=dt.call(arguments,2);return rt(function(){e.apply(t,r)},n)}function lr(e,t){var n={};return function(){var r=u+(t?t.apply(this,arguments):arguments[0]);return et.call(n,r)?n[r]:n[r]=e.apply(this,arguments)}}function cr(e){var t,n;return function(){return t?n:(t=!0,n=e.apply(this,arguments),e=null,n)}}function hr(e){return xt(e,dt.call(arguments,1))}function pr(e){return xt(e,dt.call(arguments,1),null,o)}function dr(e,t,n){function l(){o=null,f&&(u=new j,i=e.apply(s,r))}var r,i,s,o,u=0,a=!0,f=!0;return n===!1?a=!1:n&&D[typeof n]&&(a="leading"in n?n.leading:a,f="trailing"in n?n.trailing:f),function(){var n=new j;!o&&!a&&(u=n);var f=t-(n-u);return r=arguments,s=this,f<=0?(Q(o),o=null,u=n,i=e.apply(s,r)):o||(o=rt(l,f)),i}}function vr(e,t){return function(){var n=[e];return tt.apply(n,arguments),t.apply(this,n)}}function mr(e){return e==null?"":z(e).replace(b,Nt)}function gr(e){return e}function yr(e){wn(Wt(e),function(t){var n=yt[t]=e[t];yt.prototype[t]=function(){var e=this.__wrapped__,t=[e];tt.apply(t,arguments);var r=n.apply(yt,t);return e&&typeof e=="object"&&e==r?this:new Ct(r)}})}function br(){return n._=$,this}function Er(e,t){return e==null&&t==null&&(t=1),e=+e||0,t==null&&(t=e,e=0),e+Y(pt()*((+t||0)-e+1))}function Sr(e,n){var r=e?e[n]:t;return Zt(r)?e[n]():r}function xr(e,n,r){var i=yt.templateSettings;e||(e=""),r=qt({},r,i);var s=qt({},r.imports,i.imports),o=Pt(s),u=pn(s),a,h=0,d=r.interpolate||y,m="__p += '",g=U((r.escape||y).source+"|"+d.source+"|"+(d===v?p:y).source+"|"+(r.evaluate||y).source+"|$","g");e.replace(g,function(t,n,r,i,s,o){return r||(r=i),m+=e.slice(h,o).replace(w,Tt),n&&(m+="' +\n__e("+n+") +\n'"),s&&(a=!0,m+="';\n"+s+";\n__p += '"),r&&(m+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),h=o+t.length,t}),m+="';\n";var b=r.variable,E=b;E||(b="obj",m="with ("+b+") {\n"+m+"\n}\n"),m=(a?m.replace(f,""):m).replace(l,"$1").replace(c,"$1;"),m="function("+b+") {\n"+(E?"":b+" || ("+b+" = {});\n")+"var __t, __p = '', __e = _.escape"+(a?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+m+"return __p\n}";var x="\n/*\n//@ sourceURL="+(r.sourceURL||"/lodash/template/source["+S++ +"]")+"\n*/";try{var T=F(o,"return "+m+x).apply(t,u)}catch(N){throw N.source=m,N}return n?T(n):(T.source=m,T)}function Tr(e,t,n){e=(e=+e)>-1?e:0;var r=-1,s=i(e);t=yt.createCallback(t,n,1);while(++r<e)s[r]=t(r);return s}function Nr(e){return e==null?"":z(e).replace(h,Ot)}function Cr(e){var t=++s;return z(e==null?"":e)+t}function kr(e,t){return t(e),e}function Lr(){return z(this.__wrapped__)}function Ar(){return this.__wrapped__}n=n?B.defaults(e.Object(),n,B.pick(e,E)):e;var i=n.Array,k=n.Boolean,j=n.Date,F=n.Function,I=n.Math,q=n.Number,R=n.Object,U=n.RegExp,z=n.String,W=n.TypeError,X=i(),V=R(),$=n._,J=U("^"+z(V.valueOf).replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/valueOf|for [^\]]+/g,".+?")+"$"),K=I.ceil,Q=n.clearTimeout,G=X.concat,Y=I.floor,Z=J.test(Z=R.getPrototypeOf)&&Z,et=V.hasOwnProperty,tt=X.push,nt=n.setImmediate,rt=n.setTimeout,it=V.toString,st=J.test(st=it.bind)&&st,ot=J.test(ot=i.isArray)&&ot,ut=n.isFinite,at=n.isNaN,ft=J.test(ft=R.keys)&&ft,lt=I.max,ct=I.min,ht=n.parseInt,pt=I.random,dt=X.slice,vt=J.test(n.attachEvent),mt=st&&!/\n|true/.test(st+vt),gt={};gt[T]=i,gt[N]=k,gt[C]=j,gt[A]=R,gt[L]=q,gt[O]=U,gt[M]=z;var bt=yt.support={};bt.fastBind=st&&!mt,yt.templateSettings={escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:v,variable:"",imports:{_:yt}},Ct.prototype=yt.prototype;var _t=ot,Dt=function(e){var t,n=e,r=[];if(!n)return r;if(!D[typeof e])return r;for(t in n)et.call(n,t)&&r.push(t);return r},Pt=ft?function(e){return en(e)?ft(e):[]}:Dt,Ht={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Bt=Vt(Ht),jt=function(e,t,n){var r,i=e,s=i;if(!i)return s;var o=arguments,u=0,a=typeof n=="number"?2:o.length;if(a>3&&typeof o[a-2]=="function")var f=yt.createCallback(o[--a-1],o[a--],2);else a>2&&typeof o[a-1]=="function"&&(f=o[--a]);while(++u<a){i=o[u];if(i&&D[typeof i]){var l=i.length;r=-1;if(_t(i))while(++r<l)s[r]=f?f(s[r],i[r]):i[r];else{var c=-1,h=D[typeof i]?Pt(i):[],l=h.length;while(++c<l)r=h[c],s[r]=f?f(s[r],i[r]):i[r]}}}return s},qt=function(e,t,n){var r,i=e,s=i;if(!i)return s;var o=arguments,u=0,a=typeof n=="number"?2:o.length;while(++u<a){i=o[u];if(i&&D[typeof i]){var f=i.length;r=-1;if(_t(i))while(++r<f)typeof s[r]=="undefined"&&(s[r]=i[r]);else{var l=-1,c=D[typeof i]?Pt(i):[],f=c.length;while(++l<f)r=c[l],typeof s[r]=="undefined"&&(s[r]=i[r])}}}return s},Ut=function(e,t,n){var r,i=e,s=i;if(!i)return s;if(!D[typeof i])return s;t=t&&typeof n=="undefined"?t:yt.createCallback(t,n);for(r in i)if(t(i[r],r,e)===!1)return s;return s},zt=function(e,t,n){var r,i=e,s=i;if(!i)return s;if(!D[typeof i])return s;t=t&&typeof n=="undefined"?t:yt.createCallback(t,n);var o=-1,u=D[typeof i]?Pt(i):[],a=u.length;while(++o<a){r=u[o];if(t(i[r],r,e)===!1)return s}return s},sn=function(e){if(!e||it.call(e)!=A)return!1;var t=e.valueOf,n=typeof t=="function"&&(n=Z(t))&&Z(n);return n?e==n||Z(e)==n:Lt(e)},Hn=yn;mt&&r&&typeof nt=="function"&&(ar=nr(nt,n));var wr=ht(m+"08")==8?ht:function(e,t){return ht(un(e)?e.replace(g,""):e,t||0)};return yt.after=tr,yt.assign=jt,yt.at=dn,yt.bind=nr,yt.bindAll=rr,yt.bindKey=ir,yt.compact=Bn,yt.compose=sr,yt.countBy=mn,yt.createCallback=or,yt.debounce=ur,yt.defaults=qt,yt.defer=ar,yt.delay=fr,yt.difference=jn,yt.filter=yn,yt.flatten=qn,yt.forEach=wn,yt.forIn=Ut,yt.forOwn=zt,yt.functions=Wt,yt.groupBy=En,yt.initial=Un,yt.intersection=zn,yt.invert=Vt,yt.invoke=Sn,yt.keys=Pt,yt.map=xn,yt.max=Tn,yt.memoize=lr,yt.merge=fn,yt.min=Nn,yt.omit=ln,yt.once=cr,yt.pairs=cn,yt.partial=hr,yt.partialRight=pr,yt.pick=hn,yt.pluck=Cn,yt.range=Vn,yt.reject=An,yt.rest=$n,yt.shuffle=On,yt.sortBy=Dn,yt.tap=kr,yt.throttle=dr,yt.times=Tr,yt.toArray=Pn,yt.union=Kn,yt.uniq=Qn,yt.unzip=Gn,yt.values=pn,yt.where=Hn,yt.without=Yn,yt.wrap=vr,yt.zip=Zn,yt.zipObject=er,yt.collect=xn,yt.drop=$n,yt.each=wn,yt.extend=jt,yt.methods=Wt,yt.object=er,yt.select=yn,yt.tail=$n,yt.unique=Qn,yr(yt),yt.clone=Ft,yt.cloneDeep=It,yt.contains=vn,yt.escape=mr,yt.every=gn,yt.find=bn,yt.findIndex=Fn,yt.findKey=Rt,yt.has=Xt,yt.identity=gr,yt.indexOf=Rn,yt.isArguments=Mt,yt.isArray=_t,yt.isBoolean=$t,yt.isDate=Jt,yt.isElement=Kt,yt.isEmpty=Qt,yt.isEqual=Gt,yt.isFinite=Yt,yt.isFunction=Zt,yt.isNaN=tn,yt.isNull=nn,yt.isNumber=rn,yt.isObject=en,yt.isPlainObject=sn,yt.isRegExp=on,yt.isString=un,yt.isUndefined=an,yt.lastIndexOf=Xn,yt.mixin=yr,yt.noConflict=br,yt.parseInt=wr,yt.random=Er,yt.reduce=kn,yt.reduceRight=Ln,yt.result=Sr,yt.runInContext=H,yt.size=Mn,yt.some=_n,yt.sortedIndex=Jn,yt.template=xr,yt.unescape=Nr,yt.uniqueId=Cr,yt.all=gn,yt.any=_n,yt.detect=bn,yt.foldl=kn,yt.foldr=Ln,yt.include=vn,yt.inject=kn,zt(yt,function(e,t){yt.prototype[t]||(yt.prototype[t]=function(){var t=[this.__wrapped__];return tt.apply(t,arguments),e.apply(yt,t)})}),yt.first=In,yt.last=Wn,yt.take=In,yt.head=In,zt(yt,function(e,t){yt.prototype[t]||(yt.prototype[t]=function(t,n){var r=e(this.__wrapped__,t,n);return t==null||n&&typeof t!="function"?r:new Ct(r)})}),yt.VERSION="1.2.1",yt.prototype.toString=Lr,yt.prototype.value=Ar,yt.prototype.valueOf=Ar,wn(["join","pop","shift"],function(e){var t=X[e];yt.prototype[e]=function(){return t.apply(this.__wrapped__,arguments)}}),wn(["push","reverse","sort","unshift"],function(e){var t=X[e];yt.prototype[e]=function(){return t.apply(this.__wrapped__,arguments),this}}),wn(["concat","slice","splice"],function(e){var t=X[e];yt.prototype[e]=function(){return new Ct(t.apply(this.__wrapped__,arguments))}}),yt}var t,n=typeof exports=="object"&&exports,r=typeof module=="object"&&module&&module.exports==n&&module,i=typeof global=="object"&&global;if(i.global===i||i.window===i)e=i;var s=0,o={},u=+(new Date)+"",a=200,f=/\b__p \+= '';/g,l=/\b(__p \+=) '' \+/g,c=/(__e\(.*?\)|\b__t\)) \+\n'';/g,h=/&(?:amp|lt|gt|quot|#39);/g,p=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,d=/\w*$/,v=/<%=([\s\S]+?)%>/g,m=" 	\f ﻿\n\r\u2028\u2029 ᠎             　",g=RegExp("^["+m+"]*0+(?=.$)"),y=/($^)/,b=/[&<>"']/g,w=/['\n\r\t\u2028\u2029\\]/g,E=["Array","Boolean","Date","Function","Math","Number","Object","RegExp","String","_","attachEvent","clearTimeout","isFinite","isNaN","parseInt","setImmediate","setTimeout"],S=0,x="[object Arguments]",T="[object Array]",N="[object Boolean]",C="[object Date]",k="[object Function]",L="[object Number]",A="[object Object]",O="[object RegExp]",M="[object String]",_={};_[k]=!1,_[x]=_[T]=_[N]=_[C]=_[L]=_[A]=_[O]=_[M]=!0;var D={"boolean":!1,"function":!0,object:!0,number:!1,string:!1,"undefined":!1},P={"\\":"\\","'":"'","\n":"n","\r":"r","	":"t","\u2028":"u2028","\u2029":"u2029"},B=H();typeof define=="function"&&typeof define.amd=="object"&&define.amd?(e._=B,define("lib/lodash",[],function(){return B})):n&&!n.nodeType?r?(r.exports=B)._=B:n._=B:e._=B})(this),define("messaging/message",["lib/lodash","messaging"],function(e){return Message=function(){},Message.from=function(t){var n=new this;return n.toBuffer=function(){var e=require("messaging"),n=e.calcByteSize(t),r=ArrayBuffer(n),i=new DataView(r),s=0,o=0,u,a,f;while(s<t.byteformat.length)a=t.byteformat.charAt(s),u=e.format[a],f=this[t.format[s]],i["set"+u](o,f),o+=e.getTypeByteLength(u),s++;return r},ChildMessage=function(n){if(n instanceof ArrayBuffer){var r=require("messaging"),i=new DataView(n),s=0,o=0,u,a,f,l;while(s<t.byteformat.length)u=t.byteformat.charAt(s),format=r.format[u],l=r.extractValue(i["get"+format](o),u),this[t.format[s]]=l,o+=r.getTypeByteLength(format),s++}else e.extend(this,n)},ChildMessage.prototype=n,ChildMessage.constructor=ChildMessage,ChildMessage.extend=arguments.calee,ChildMessage.schema=t,ChildMessage},Message}),define("messaging/frame",["messaging/message"],function(e){var t={format:["id","x","y","direction","state"],byteformat:"IffBB"},n=e.from(t);return n}),define("messaging",["require","messaging/frame"],function(e,t){var n={format:{b:"Int8",B:"Uint8","?":"Uint8",h:"Int16",H:"Uint16",i:"Int32",I:"Uint32",f:"Float32",d:"Float64"},messages:{1:t},getTypeByteLength:function(e){return window[e+"Array"].BYTES_PER_ELEMENT},calcByteSize:function(e){var t=0,n=0,r;while(n<e.byteformat.length)r=this.format[e.byteformat.charAt(n)],t+=this.getTypeByteLength(r),n++;return t},extractValue:function(e,t){return t==="?"&&(e=!!e),e},fromBuffer:function(e){var t=new DataView(e),n=this.messages[t.getUint8(0)],r=this.calcByteSize(n.schema),i=1,s,o=[];while(i<e.byteLength)s=new n(e.slice(i,i+r)),o.push(s),i+=r;return o}};return n}),requirejs(["messaging"],function(e){}),define("archers",function(){});