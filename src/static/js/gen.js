
var sketch = function(p) {
  p.cnv = null;
  p.gif = null;
  p.idx = 0;
  p.interval_id = 0;
  p.font = null;
  p.params = {}

  p.get_sin = function(idx, a, k, h){
    var x;
    x = ((2*Math.PI)/60)*idx;
    return a * Math.sin(x+h) + k;
  }

  p.get_tri = function(idx, a, k, h){
    var x;
    x = ((2*Math.PI)/60)*idx;
    return (2*a)/Math.PI * (Math.asin(Math.sin(x + h))) + k;
  }

  p.get_circle = function(idx, speed){
    return idx * (6*speed)
  }

  p.preload = function(){
    p.font = p.loadFont('static/fonts/Ubuntu-B.ttf');
  }

  p.setup = function() {
    p.noLoop();
    p.cnv = p.createCanvas(200, 200);
    p.cnv.parent('gifcanvas');
    p.textFont(p.font);
    p.angleMode(p.DEGREES);
    p.setupGIF();
    p.setindex();
  }

  p.load_params = function() {
    // text
    p.params.fcolor = p.select('#fcolor').elt.value
    p.params.scolor = p.select('#scolor').elt.value
    p.params.txt = p.select('#inptext').elt.value
    p.params.ssize= p.select('#ssize').elt.value
    p.params.txtstart = parseInt(p.select('#txtstart').elt.value)
    p.params.txtsizestyle = p.select("#txtsizestyle").elt.value
    p.params.txtrotstyle = p.select("#txtrotstyle").elt.value
    p.params.txtamp = parseInt(p.select('#txtamp').elt.value)
    p.params.rotamp = parseInt(p.select('#rotamp').elt.value)
    p.params.spinspeed = parseInt(p.select('#spinspeed').elt.value)
    // background
    p.params.arcsize= parseInt(p.select('#arcsize').elt.value)
    p.params.centercirclesize= parseInt(p.select('#centercirclesize').elt.value)
    p.params.centercirclecolor = p.select('#centercirclecolor').elt.value
    p.params.colorcnt = parseInt(p.select('#colorcnt').elt.value)
    // p.params.sectioncnt = parseInt(p.select('#sectioncnt').elt.value)
    p.params.sectioncnt = 60
    p.params.angles = []
    p.params.colors = []
    for (i=0; i < p.params.colorcnt; i++) {
      p.params.angles.push(parseInt(p.select('#angle' + (i+1)).elt.value))
      p.params.colors.push(p.select('#color' + (i+1)).elt.value)
    }
  }

  p.start = function() {
    p.all_frames =function(){
      p.current_frame(true)
    }
    p.interval_id = setInterval(p.all_frames, 40);
    p.interval_elem = p.select('#interval')
    p.interval_elem.elt.value = p.interval_id
  }

  p.stop = function() {
    p.interval_elem = p.select('#interval')
    p.interval_id = p.interval_elem.elt.value
    clearInterval(p.interval_id)
    p.interval_id = null;
  }

  p.saveemoji = function() {
    p.stop()
    p.idx = 0
    p.all_frames= function(){
      p.current_frame(false)
    }

    p.interval_id = setInterval(p.all_frames, 40);
    p.interval_elem = p.select('#interval')
    p.interval_elem.elt.value = p.interval_id
  }

  p.setindex = function(x) {
    p.stop()
    if (typeof x == 'undefined') {
      p.idx = parseInt(document.querySelector('#frameidx').value)
    } else {
      p.idx += x
    }
    p.current_frame(true)
  }


  p.current_frame = function(preview) {
    p.clear();
    // background
    bg_x = p.width / 2
    bg_y = p.height / 2
    p.drawbackground(bg_x, bg_y, p.idx*6)

    // text
    txt_x = p.width / 2
    txt_y = p.height / 2
    p.drawtext(txt_x, txt_y, p.idx)

    if (!preview) {
    p.gif.addFrame(p.cnv.elt, {
              delay: 40,
              copy: true
          });
    }
    p.idx += 1;
    if (p.idx < 0) {
      p.idx = 60 + p.idx
    }
    if (p.idx >= 60 ) {
      p.idx = 0;
      if (!preview) {
        clearInterval(p.interval_id)
        p.gif.render();
      }
    }
    document.querySelector("#frameidx").value = p.idx;
  }

  p.drawtext = function(x, y, idx){
    if (!p.params.txt) { return ;}
    scolor = p.color(p.params.scolor)
    //scolor.setAlpha(params.scoloralpha)
    fcolor = p.color(p.params.fcolor)
    //fcolor.setAlpha(params.fcoloralpha)
    var textSize;
    p.params.txtsizestyle = p.random(['tri', 'sin'])
    switch (p.params.txtsizestyle) {
      case 'tri':
        textSize = p.get_tri(idx, p.params.txtamp, p.params.txtstart, 0);
        break;
      case 'sin':
        textSize = p.get_sin(idx, p.params.txtamp, p.params.txtstart, 0);
        break;
      default:
        textSize = p.get_sin(idx, p.params.txtamp, p.params.txtstart, 0);
    }
    p.textSize(textSize);
    p.textAlign(p.CENTER, p.CENTER);
    if (p.params.ssize > 0) {
      p.stroke(scolor);
      p.strokeWeight(p.params.ssize);
    } else {
      p.noStroke();
    };
    p.fill(fcolor);
    bbox = p.font.textBounds(p.params.txt, x, y)
    p.push()
    dx = bbox.x + (bbox.w / 2)
    dy = bbox.y + (bbox.h / 2)
    p.translate(dx , dy)
    var textRotate;
    p.params.txtrotstyle = p.random(['tri', 'sin','tri', 'sin','tri','sin','tri','sin','circ'])
    switch (p.params.txtrotstyle) {
      case 'tri':
        textRotate = p.get_tri(idx, p.params.rotamp, 0, 0);
        break;
      case 'sin':
        textRotate= p.get_sin(idx, p.params.rotamp, 0, 0);
        break;
      case 'circ':
        textRotate= p.get_circle(idx, p.params.spinspeed);
        break;
      default:
        textRotate= p.get_sin(idx, p.params.rotamp, 0, 0);
    }
    p.rotate(textRotate)
    p.translate(-dx , -dy)
    //p.rect(bbox.x, bbox.y, bbox.w, bbox.h)  //debug bounding box
    adj_x = 100 - dx;
    adj_y = 100 - dy;
    p.text(p.params.txt, x + adj_x, y + adj_y);
    p.pop()
  }

  p.drawbackground = function(x, y, startangle){
    // startangle = idx * 6 which is the starting spot of the arc
    p.noStroke();
    angle = 0;
    for (let i = 0; i < p.params.sectioncnt; i++) {
        //p.fill(p.params.colors[i % p.params.colors.length]);
        r = p.random(255);
        g = p.random(255);
        b = p.random(255);
        a = p.random(200,255);
        p.fill(r,g,b,a);
        arcbeg = startangle + angle
        //arcend = arcbeg + p.params.angles[i % p.params.angles.length]
        arcend = arcbeg + 6
        p.arc(x, y, p.params.arcsize, p.params.arcsize, arcbeg, arcend);
        //angle += p.params.angles[i % p.params.angles.length];
        angle += 6
      }

    if (p.params.centercirclesize > 0) {
      p.fill(p.params.centercirclecolor);
      p.ellipse(x, y, p.params.centercirclesize, p.params.centercirclesize);
    }
  }

  p.setupGIF = function() {
    p.gif = new GIF({
        workers: 5,
        quality: 20,
        workerScript: "static/js/gif.worker.js"
    });
    p.gif.on('finished', function(blob) {
        window.open(URL.createObjectURL(blob));
        p.gif.abort();
        p.gif.frames = [];
        delete p.gif.imageParts;
        delete p.gif.finishedFrames;
        delete p.gif.nextFrame;
    });
  }
}

var sf = new p5(sketch);

colorcfg = {
  1 : {default:1, enabled: [1]},
  2 : {default:8, enabled: [2,4,6,8,10,12]},
  3 : {default:9, enabled: [3,6,9,12]},
  4 : {default:8, enabled: [4,8,12]},
  5 : {default:5, enabled: [5,10]},
  6 : {default:6, enabled: [6,12]},
  8 : {default:8, enabled: [8]},
  9 : {default:9, enabled: [9]},
  10 : {default:10, enabled: [10]},
  12 : {default:12, enabled: [12]}
}

resetUI = function() {
  document.querySelector("#frameidx").value = sf.idx;
  var colorcnt = parseInt(document.querySelector("#colorcnt").value);
  var last_colorcnt_elem = document.querySelector("#last_colorcnt");
  var last_colorcnt = parseInt(last_colorcnt_elem.value);
  var sectioncnt_elem = document.querySelector("#sectioncnt");
  var sectioncnt = parseInt(sectioncnt_elem.value);
  var last_sectioncnt_elem = document.querySelector("#last_sectioncnt");
  var last_sectioncnt = parseInt(last_sectioncnt_elem.value);
  cfg = colorcfg[colorcnt];
  if (colorcnt != last_colorcnt) {
    last_sectioncnt = -1
    for (i=0; i < sectioncnt_elem.options.length; i++) {
      o = sectioncnt_elem.options[i]
      if (cfg.enabled.includes(parseInt(o.value))) {
        o.disabled = false;
      } else {
        o.disabled = true;
      }
      if (o.value === String(cfg.default)) {
        o.selected = true;
      }
    }
  }

  sectioncnt = parseInt(sectioncnt_elem.value);
  a = 360 / sectioncnt;
  for (i=1; i<13; i++) {
    color_elem = document.querySelector("#color" + i);
    angle_elem = document.querySelector("#angle" + i);
    if (i <= colorcnt) {
      color_elem.parentNode.style.visibility = 'visible'
      if (sectioncnt != last_sectioncnt) {
        angle_elem.value = a;
      }
    } else {
      color_elem.parentNode.style.visibility = 'hidden'
      if (sectioncnt != last_sectioncnt) {
        angle_elem.value = 0;
      }
    }
  last_sectioncnt_elem.value  = sectioncnt;
  last_colorcnt_elem.value  = colorcnt;
  }
  sf.load_params();
  if (sf.interval_id !== 0) {
    sf.current_frame(true);
  }
}
