var daquda=function(a){function b(a,b){this.data=b=b||[];this.fields=a;this.listeners=[];for(var h in a)b[h]||(b[h]=[])}b.prototype=a;return function(a,e){return new b(a,e)}}({create:function(a){return this.crud(a)},read:function(a){return this.crud(a,1)},update:function(a){return this.crud(a,2)},del:function(a){return this.crud([].concat(a),3)},crud:function(a,b){a=a||[];var d=this.data,e,h=d[0],f=-1,c,g=h.length;if(b&&a[0])for(e=a[0],c=0;c<g;c++)if(h[c]==e){f=c;break}b||(f=g,a[0]=this.newKey());if(-1<f){c=0;g=d.length;if(3==b)for(;c<g;c++)a[c]=d[c].splice(f,1)[0];else if(1==b)for(;c<g;c++)a[c]=d[c][f];else for(;c<g;c++)d[c][f]=a[c];if(b^1)for(e in b=b^3?b^2?"create":"update":"delete",c=this.listeners)c[e]&&c[e](b,f,a);return a}},observe:function(a){var b=this.listeners;if(a in b)b[a]=null;else{var d=b.length;b[d]=a;return d}},newKey:function(){var a=this.data[0];return(a[a.length-1]||0)+1}});