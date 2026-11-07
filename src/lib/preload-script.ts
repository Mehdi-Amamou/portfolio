// Première visite de la session uniquement, jamais avec reduced-motion. Durée totale ≤ 800 ms.
export const PRELOAD_SCRIPT = `(function(){try{
var d=document.documentElement;
if(matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem("mh-pre"))return;
sessionStorage.setItem("mh-pre","1");
d.setAttribute("data-pre","");
setTimeout(function(){d.removeAttribute("data-pre")},800);
}catch(e){}})();`;
