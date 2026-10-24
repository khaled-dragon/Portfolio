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

  var btn=document.getElementById('play'),bgm=document.getElementById('bgm');
if(btn&&bgm){
  btn.addEventListener('click',function(){
    if(bgm.paused){
      bgm.play().then(function(){
        btn.setAttribute('aria-pressed','true');
        btn.setAttribute('aria-label','Pause music');
      }).catch(function(){});
    }else{
      bgm.pause();
      btn.setAttribute('aria-pressed','false');
      btn.setAttribute('aria-label','Play music');
    }
  });
}

var form=document.getElementById('cform');
if(form){
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var st=document.getElementById('cform-status');
    var sendBtn=form.querySelector('button');
    sendBtn.disabled=true;
    st.textContent='Sending...';
    fetch(form.action,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)})
      .then(function(r){return r.json();})
      .then(function(d){
        if(d.success){st.textContent='Thanks! Your message was sent.';form.reset();}
        else{st.textContent='Something went wrong. Please email me directly.';}
      })
      .catch(function(){st.textContent='Network error. Please try again.';})
      .then(function(){sendBtn.disabled=false;});
  });
}

var board=document.getElementById('board'),info=document.getElementById('info');
if(board&&info){
  var z=10,hideT,sel=null;
  var iIco=document.getElementById('info-ico'),iName=document.getElementById('info-name'),iDesc=document.getElementById('info-desc');

  function showInfo(el){
    iIco.style.backgroundImage='url("'+el.querySelector('img').src+'")';
    iName.textContent=el.dataset.name;
    iDesc.textContent=el.dataset.desc;
    info.classList.add('show');
    clearTimeout(hideT);
    hideT=setTimeout(function(){info.classList.remove('show');},3000);
  }
  function select(el){
    if(sel&&sel!==el)sel.classList.remove('sel');
    sel=el;
    if(el)el.classList.add('sel');
  }
  function inner(){
    var b=board.getBoundingClientRect();
    var L=b.left+board.clientLeft,T=b.top+board.clientTop;
    return {L:L,T:T,R:L+board.clientWidth,B:T+board.clientHeight};
  }
  board.addEventListener('pointerdown',function(e){if(e.target===board)select(null);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')select(null);});

  board.querySelectorAll('.stk').forEach(function(el){
    var st={x:0,y:0,k:1,rot:parseFloat(getComputedStyle(el).rotate)||0};
    var sx=0,sy=0,minX=0,maxX=0,minY=0,maxY=0;
    function apply(){el.style.translate=st.x+'px '+st.y+'px';}
    function fit(){
      var i=inner(),r=el.getBoundingClientRect(),dx=0,dy=0;
      if(r.left<i.L)dx=i.L-r.left;else if(r.right>i.R)dx=i.R-r.right;
      if(r.top<i.T)dy=i.T-r.top;else if(r.bottom>i.B)dy=i.B-r.bottom;
      st.x+=dx;st.y+=dy;apply();
    }

    var hr=document.createElement('span');hr.className='h h-rot';
    var hs=document.createElement('span');hs.className='h h-size';
    el.appendChild(hr);el.appendChild(hs);

    /* move */
    el.addEventListener('pointerdown',function(e){
      var i=inner(),r=el.getBoundingClientRect();
      minX=i.L-(r.left-st.x);maxX=i.R-(r.left-st.x)-r.width;
      minY=i.T-(r.top-st.y);maxY=i.B-(r.top-st.y)-r.height;
      sx=e.clientX-st.x;sy=e.clientY-st.y;
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
      el.style.zIndex=++z;
      select(el);
      showInfo(el);
    });
    el.addEventListener('pointermove',function(e){
      if(!el.hasPointerCapture(e.pointerId))return;
      st.x=Math.min(maxX,Math.max(minX,e.clientX-sx));
      st.y=Math.min(maxY,Math.max(minY,e.clientY-sy));
      apply();
    });
    function end(){el.classList.remove('dragging');}
    el.addEventListener('pointerup',end);
    el.addEventListener('pointercancel',end);
    el.addEventListener('click',function(e){if(e.detail===0){select(el);showInfo(el);}});

    /* rotate */
    hr.addEventListener('pointerdown',function(e){
      e.stopPropagation();
      hr.setPointerCapture(e.pointerId);
      var r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
      var a0=Math.atan2(e.clientY-cy,e.clientX-cx),r0=st.rot;
      hr._m=function(ev){
        var d=r0+(Math.atan2(ev.clientY-cy,ev.clientX-cx)-a0)*180/Math.PI;
        if(ev.shiftKey)d=Math.round(d/15)*15;
        st.rot=d;
        el.style.rotate=d+'deg';
      };
    });
    hr.addEventListener('pointermove',function(e){if(hr.hasPointerCapture(e.pointerId)&&hr._m)hr._m(e);});
    hr.addEventListener('pointerup',function(){hr._m=null;fit();});

    /* resize */
    hs.addEventListener('pointerdown',function(e){
      e.stopPropagation();
      hs.setPointerCapture(e.pointerId);
      var r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
      var d0=Math.hypot(e.clientX-cx,e.clientY-cy)||1,k0=st.k;
      hs._m=function(ev){
        st.k=Math.min(2.2,Math.max(.5,k0*Math.hypot(ev.clientX-cx,ev.clientY-cy)/d0));
        el.style.setProperty('--k',st.k);
      };
    });
    hs.addEventListener('pointermove',function(e){if(hs.hasPointerCapture(e.pointerId)&&hs._m)hs._m(e);});
    hs.addEventListener('pointerup',function(){hs._m=null;fit();});
  });
}

  var els=document.querySelectorAll('.rv');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return;}
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
  },{threshold:.12});
  els.forEach(function(e){io.observe(e)});
})();
