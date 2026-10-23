(function(){
  document.documentElement.classList.add('js');
  var track=document.querySelector('.track');
if(track){
  Array.from(track.children).forEach(function(card){
    var c=card.cloneNode(true);
    c.classList.add('clone');
    c.setAttribute('aria-hidden','true');
    c.querySelectorAll('a').forEach(function(a){a.tabIndex=-1;});
    track.appendChild(c);
  });
}
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
