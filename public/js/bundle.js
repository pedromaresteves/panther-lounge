!function(e){var t={};function n(a){if(t[a])return t[a].exports;var o=t[a]={i:a,l:!1,exports:{}};return e[a].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(a,o,function(t){return e[t]}.bind(null,o));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=142)}({142:function(e,t,n){"use strict";function a(){const e=document.getElementById("available-songs"),t=document.getElementsByClassName("delete-song");function n(t){t.preventDefault();const n=t.target,a=document.querySelector("a[href='"+n.attributes.href.value+"'").parentElement,r=n.href.replace("guitar-chords","api");var i;if(!(i=new XMLHttpRequest))return alert("Giving up :( Cannot create an XMLHTTP instance"),!1;i.onreadystatechange=function(){if(4===i.readyState){const l=JSON.parse(i.response);var t=document.createElement("div"),n=document.createTextNode(l.deletedMsg);t.className+="text-muted text-center text-monospace",t.appendChild(n),a.remove(),e.prepend(t);var r=window.setInterval(function(){e.removeChild(t),clearInterval(r),l.redirectUrl&&(window.location=l.redirectUrl)},1500);o(window.location.search.match(/[0-9]/g).join(""))}},i.open("DELETE",r),i.send()}for(let e=0;e<t.length;e++)t[e].addEventListener("click",n)}function o(e){let t=new XMLHttpRequest;if(!t)return alert("Giving up :( Cannot create an XMLHTTP instance"),!1;t.onreadystatechange=function(){const e=document.querySelector("#page-results");let n="";if(4===t.readyState){const o=JSON.parse(t.response);1==o.length?o[0].forEach(function(e){n+=`<li class="list-group-item artist-item"><a href="/guitar-chords/${e.link}">${e.artist}</a><span>${e.nOfSongs} songs</span></li>`}):o[0].forEach(function(e){n+=`<li class="list-group-item artist-item"><a href="${o[1]}/${e.link}">${e.title}</a><span><a href="edit-song/${o[1]}/${e.link}" class="mr-3">Edit</a><a href="/" data-toggle="modal" data-target="#modal-${e.title.replace(/\s/g,"")}">Delete</a></span></li>\n            <div class="modal fade" id="modal-${e.title.replace(/\s/g,"")}" tabindex="-1" role="dialog" aria-labelledby="${e.link}-label" aria-hidden="true">\n            <div class="modal-dialog" role="document">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <h5 class="modal-title" id="${e.link}-label">Delete Song Warning</h5>\n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                        <span aria-hidden="true">&times;</span>\n                        </button>\n                    </div>\n                    <div class="modal-body">\n                        Are you sure you want to delete this song?\n                    </div>\n                    <div class="modal-footer">\n                        <a id="closeDialog" href="/" data-dismiss="modal">Close</a>\n                        <a class="delete-song" data-dismiss="modal" href="${o[1]}/${e.link}">Delete Song</a>\n                    </div>\n                    </div>\n                </div>\n            </div>`}),e.innerHTML=n,a()}},t.open("GET",`${window.location.origin}${window.location.pathname.replace("guitar-chords","api")}?page=${e}`),t.send()}function r(){const e=document.querySelectorAll("#pag-nav ul li");for(let n=0;n<e.length;n++)e[n].addEventListener("click",t);function t(t){t.preventDefault();let n=t.target.textContent;history.pushState({id:`page ${t.target.textContent}`},"New Page",`${t.target.origin}${t.target.pathname}?page=${t.target.textContent}`);for(let t=0;t<e.length;t++)e[t].firstChild.classList.remove("clicked-page-button");t.target.classList.add("clicked-page-button"),o(n)}}n.r(t),$(function(){$('[data-toggle="tooltip"]').tooltip({animated:"fade",placement:"bottom",html:!0})});const i=window.location.pathname.match(/\//g).length;-1!=window.location.pathname.indexOf("/guitar-chords")&&1==i&&r(),-1!=window.location.pathname.indexOf("/guitar-chords/")&&-1==window.location.pathname.indexOf("add-song")&&2==i&&(r(),a()),-1==window.location.pathname.indexOf("/guitar-chords/add-song")&&-1==window.location.pathname.indexOf("/guitar-chords/edit-song")||function(){const e=document.querySelector("form");let t=document.querySelector("input[name=artist]"),n=document.querySelector("input[name=title]");const a=[t,n];let o=document.querySelector("input[name=lyrics]"),r=document.querySelector("#submitButton");var i=new Quill("#editor",{modules:{toolbar:"#toolbar"},placeholder:"Compose an epic...",theme:"snow"});if(o.value){const e=JSON.parse(o.attributes.value.value).ops;let t=[];e.forEach(function(e){t.push(e)}),i.setContents(t)}function l(e){return""!==e}function s(e,t){let n={errors:!1,msg:""};return!1===l(e)&&(n.msg+="You must insert an Artist <br>"),!1===l(t)&&(n.msg+="You must insert a Title <br>"),n.msg.length>0&&(n.errors=!0),n}-1!==window.location.pathname.indexOf("/edit-song/")&&(t.disabled=!0);for(let e=0;e<a.length;e++)a[e].addEventListener("blur",function(e){!1===s(t.value,n.value).errors?r.disabled=!1:r.disabled=!0});!1===s(t.value,n.value).errors&&(r.disabled=!1),e.onsubmit=function(a){const r=window.location.href.replace("guitar-chords","api");o.value=JSON.stringify(i.getContents());const l=JSON.stringify({artist:t.value,title:n.value,lyricsAndChords:o.value});var s;if(a.preventDefault(),!(s=new XMLHttpRequest))return alert("Giving up :( Cannot create an XMLHTTP instance"),!1;s.onreadystatechange=function(){if(4===s.readyState){const t=JSON.parse(s.response);if(t.errorMsg){const n=document.createElement("div"),a=document.createTextNode(t.errorMsg);n.className+="text-danger text-center text-monospace",n.appendChild(a),e.prepend(n);const o=window.setInterval(function(){e.removeChild(n),clearInterval(o)},3e3);return!0}if(t.redirectUrl)return window.location=t.redirectUrl,!0}},s.open("POST",r),s.setRequestHeader("Content-Type","application/json"),s.send(l)}}()}});