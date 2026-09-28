import{a as B,S as P,i as l}from"./assets/vendor-WAqoS4Lj.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function s(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=s(r);fetch(r.href,o)}})();const M="https://pixabay.com/api/",$="50891107-566f278151ee6a9d75cddbbab",f=15;async function y(e,t=1){return(await B.get(M,{params:{key:$,q:e,image_type:"photo",orientation:"horizontal",safesearch:!0,page:t,per_page:f}})).data}const g=document.querySelector(".gallery"),m=document.querySelector(".loader"),p=document.querySelector(".load-more-btn"),E=new P(".gallery a",{captionsData:"alt",captionDelay:250});function h(e){const t=e.map(({webformatURL:s,largeImageURL:n,tags:r,likes:o,views:a,comments:S,downloads:q})=>`
      <li class="gallery-item">
        <a class="gallery-link" href="${n}">
          <img class="gallery-image" src="${s}" alt="${r}" loading="lazy" />
        </a>
        <ul class="gallery-info">
          <li class="gallery-info-item">
            <p class="gallery-info-title">Likes</p>
            <p class="gallery-info-value">${o}</p>
          </li>
          <li class="gallery-info-item">
            <p class="gallery-info-title">Views</p>
            <p class="gallery-info-value">${a}</p>
          </li>
          <li class="gallery-info-item">
            <p class="gallery-info-title">Comments</p>
            <p class="gallery-info-value">${S}</p>
          </li>
          <li class="gallery-info-item">
            <p class="gallery-info-title">Downloads</p>
            <p class="gallery-info-value">${q}</p>
          </li>
        </ul>
      </li>
    `).join("");g.insertAdjacentHTML("beforeend",t),E.refresh()}function x(){g.innerHTML=""}function O(){m.classList.add("is-visible")}function A(){m.classList.remove("is-visible")}function R(){p.classList.add("is-visible")}function b(){p.classList.remove("is-visible")}l.settings({position:"topRight",timeout:5e3});const d=document.querySelector(".form"),_=d.querySelector('button[type="submit"]'),L=document.querySelector(".load-more-btn"),C=document.querySelector(".gallery");let u="",i=1;d.addEventListener("submit",D);L.addEventListener("click",H);async function D(e){e.preventDefault();const t=d.elements["search-text"].value.trim();if(!t){l.warning({message:"Please enter a search query."});return}u=t,i=1,x(),b(),c(!0);try{const s=await y(u,i);if(s.hits.length===0){l.error({message:"Sorry, there are no images matching your search query. Please try again!"});return}h(s.hits),v(s.totalHits)}catch(s){w(s)}finally{c(!1)}}async function H(){const e=i+1;c(!0);try{const t=await y(u,e);i=e,h(t.hits),T(),v(t.totalHits)}catch(t){w(t)}finally{c(!1)}}function v(e){const t=Math.ceil(e/f);if(i>=t){b(),l.info({message:"We're sorry, but you've reached the end of search results."});return}R()}function T(){const e=C.firstElementChild;if(!e)return;const{height:t}=e.getBoundingClientRect();window.scrollBy({top:t*2,behavior:"smooth"})}function c(e){_.disabled=e,L.disabled=e,e?O():A()}function w(e){l.error({message:`Something went wrong: ${e.message}`})}
//# sourceMappingURL=index.js.map
