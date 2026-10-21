(function(){
  document.documentElement.classList.add('js');
  try{document.getElementById('yr').textContent=new Date().getFullYear();}catch(e){}
  document.querySelectorAll('.viz img').forEach(function(img){
    function empty(){img.parentNode.classList.add('is-empty');}
    img.addEventListener('error',empty);
    if(img.complete&&!img.naturalWidth)empty();
  });
  var els=document.querySelectorAll('.rv');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return;}
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
  },{threshold:.12});
  els.forEach(function(e){io.observe(e)});
})();
