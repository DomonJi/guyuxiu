'use strict'
import THREE from 'three'
import controller from './controller'
var camera,
  scene,
  mesh,
  jumps = -1,
  element = document.getElementById('main'), // Inject scene into this
  renderer,
  onPointerDownPointerX,
  onPointerDownPointerY,
  onPointerDownLon,
  onPointerDownLat,
  isUserInteracting = false,
  lat = 0,
  phi = 0,
  theta = 0,
  field = 4,
  onMouseDownMouseX = 0,
  onMouseDownMouseY = 0,
  onMouseDownLon = 0,
  onMouseDownLat = 0,
  currentScene = controller.getCurrentScene(),
  lon = currentScene.initLon,
  fov = currentScene.fovMax,
  width = window.innerWidth,
  height = window.innerHeight,
  ratio = width / height

const cachedLoader = (progress, error) => {
  var cached = []
  var loader = new THREE.TextureLoader()
  return (currentScene, cb) => {
    return new Promise((resolve, reject) => {
      let tex = cached[currentScene.index]
      if (tex === undefined) {
        tex = loader.load(currentScene.path, () => {}, progress, error)
        cached[currentScene.index] = tex
      } else {
        console.log('cached')
      }
      resolve(tex)
    }).then(cb).then(() => {
      [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ].forEach((j) => {
        if (cached[j] === undefined && controller.getJumpScene(j)) {
          cached[j] = loader.load(controller.getJumpScene(j).path)
        }
      })
    })
  }
}

const initTexCb = (tex) => {
  return new Promise((res, rej) => {
    init(tex)
    animate()
    res()
  })
}

const texCb = (tex) => {
  return new Promise((res, rej) => {
    mesh.material = new THREE.MeshBasicMaterial({map: tex})
    currentScene.jump.forEach((j) => scene.add(j.plane))
    updateDes(currentScene.des)
    res()
  })
}

var cachedLoad = cachedLoader(function(xhr) {
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, function(xhr) {
  console.log('An error happened');
})

cachedLoad(currentScene, initTexCb)

updateDes(currentScene.des)

function init(texture) {
  camera = new THREE.PerspectiveCamera(fov, ratio, 1, 1000);
  scene = new THREE.Scene();
  mesh = new THREE.Mesh(new THREE.SphereGeometry(500, 60, 40), new THREE.MeshBasicMaterial({map: texture}));
  mesh.scale.x = -1;
  scene.add(mesh);
  currentScene.jump.forEach((j) => scene.add(j.plane));
  // scene.add(guid);
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width, height);
  element.appendChild(renderer.domElement);
  element.addEventListener('mousedown', onDocumentMouseDown, false);
  element.addEventListener('mousewheel', onDocumentMouseWheel, false);
  element.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
  window.addEventListener('resize', onWindowResized, false);
  document.addEventListener('mousedown', detectClick, false);
  document.addEventListener('mouseup', detectClickUp, false);
  document.addEventListener('mousemove', detectMove, false);
  onWindowResized(null);
}
var canjump = false;
function detectClickUp(event) {
  if (jumps > -1 && canjump) {
    controller.jumpScene(jumps)
    canjump = false
  } else {
    canjump = false
  }
}

function detectClick(e) {
  if (jumps > -1) {
    canjump = true
  } else {
    canjump = false
  }
}

function detectMove(event) {
  let raycaster = new THREE.Raycaster();
  event.preventDefault();

  let mouseVector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
  raycaster.setFromCamera(mouseVector, camera);
  jumps = -1;
  currentScene.jump.forEach(function(j) {
    let intersects = raycaster.intersectObject(j.plane)
    if (intersects.length > 0) {
      jumps = j.jumpto
    };

  });
  // let intersect2 = raycaster.intersectObjects(scene.children, true)
  // console.log(intersect2);
  if (jumps > -1) {
    //console.log(intersects[0]);
    document.body.style.cursor = "pointer";
  } else
    document.body.style.cursor = "default";
  }
;

function onWindowResized(event) {
  //  renderer.setSize(window.innerWidth, window.innerHeight);
  //  camer?a.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 1100);
  renderer.setSize(width, height);
  camera.projectionMatrix.makePerspective(fov, ratio, 1, 1100);
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  onPointerDownPointerX = event.clientX;
  onPointerDownPointerY = event.clientY;
  onPointerDownLon = lon;
  onPointerDownLat = lat;
  isUserInteracting = true;
  element.addEventListener('mousemove', onDocumentMouseMove, false);
  element.addEventListener('mouseup', onDocumentMouseUp, false);
}
function onDocumentMouseMove(event) {
  lon = (event.clientX - onPointerDownPointerX) * -0.175 + onPointerDownLon;
  lat = (event.clientY - onPointerDownPointerY) * -0.175 + onPointerDownLat;
}
function onDocumentMouseUp(event) {
  isUserInteracting = false;
  element.removeEventListener('mousemove', onDocumentMouseMove, false);
  element.removeEventListener('mouseup', onDocumentMouseUp, false);
  console.log(lon);
}
function onDocumentMouseWheel(event) {
  // WebKit
  if (event.wheelDeltaY) {
    fov -= event.wheelDeltaY * 0.05;
    // Opera / Explorer 9
  } else if (event.wheelDelta) {
    fov -= event.wheelDelta * 0.05;
    // Firefox
  } else if (event.detail) {
    fov += event.detail * 1.0;
  }
  if (fov < 45 || fov > currentScene.fovMax) {
    fov = (fov < 45)
      ? 45
      : currentScene.fovMax;
  }
  camera.projectionMatrix.makePerspective(fov, ratio, 1, 1100);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}
let rotation = 1
function render() {
  !isUserInteracting && (() => {
    lon += 0.04 * rotation
  })()
  if (lon < currentScene.lonmin || lon > currentScene.lonmax) {
    rotation = -rotation
  }
  if (currentScene.lonmin && currentScene.lonmax) {
    lon = Math.max(currentScene.lonmin, Math.min(currentScene.lonmax, lon))
  }
  lat = Math.max(-currentScene.latConstrain, Math.min(currentScene.latConstrain, lat));
  // lat = 0
  phi = THREE.Math.degToRad(90 - lat);
  theta = THREE.Math.degToRad(lon);
  camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
  camera.position.y = 100 * Math.cos(phi);
  camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
  camera.lookAt(scene.position);
  if (currentScene != controller.getCurrentScene()) {
    currentScene.jump.forEach((j) => scene.remove(j.plane));
    currentScene = controller.getCurrentScene();
    if (currentScene.field !== field) {
      eval('changeImage' + currentScene.field + '()')
    }
    console.log(currentScene)
    cachedLoad(currentScene, texCb)
    lon = currentScene.initLon
    lat = 0
    fov = currentScene.fovMax
    camera.projectionMatrix.makePerspective(fov, ratio, 1, 1100)
  }
  renderer.render(scene, camera);
}

function updateDes(des) {}

function changeImage0() {
  field = 0
  document.getElementById("Image1").src = "./images/4_cc.jpg";
  document.getElementById("Image2").src = "./images/3.jpg";
  document.getElementById("Image3").src = "./images/2.jpg";
  document.getElementById("Image4").src = "./images/1.jpg";
  document.getElementById("Image5").src = "./images/0.jpg";
  document.getElementById("Image6").src = "./images/5.jpg";
  document.getElementById("Image7").src = "./images/6.jpg";
  controller.jumpScene(5)
}

function changeImage1() {}

function changeImage2() {
  field = 2
  document.getElementById("Image3").src = "./images/2_cc.jpg";
  document.getElementById("Image1").src = "./images/4.jpg";
  document.getElementById("Image2").src = "./images/3.jpg";
  document.getElementById("Image4").src = "./images/1.jpg";
  document.getElementById("Image5").src = "./images/0.jpg";
  document.getElementById("Image6").src = "./images/5.jpg";
  document.getElementById("Image7").src = "./images/6.jpg";
  controller.jumpScene(2)
}

function changeImage3() {}

function changeImage4() {
  field = 4
  document.getElementById("Image5").src = "./images/0_cc.jpg";
  document.getElementById("Image1").src = "./images/4.jpg";
  document.getElementById("Image3").src = "./images/2.jpg";
  document.getElementById("Image4").src = "./images/1.jpg";
  document.getElementById("Image2").src = "./images/3.jpg";
  document.getElementById("Image6").src = "./images/5.jpg";
  document.getElementById("Image7").src = "./images/6.jpg";
  controller.jumpScene(0)
}

function changeImage5() {
  field = 5
  document.getElementById("Image6").src = "./images/5_cc.jpg";
  document.getElementById("Image5").src = "./images/0.jpg";
  document.getElementById("Image1").src = "./images/4.jpg";
  document.getElementById("Image3").src = "./images/2.jpg";
  document.getElementById("Image4").src = "./images/1.jpg";
  document.getElementById("Image2").src = "./images/3.jpg";
  document.getElementById("Image7").src = "./images/6.jpg";
  controller.jumpScene(8)
}
function changeImage6() {
  field = 6
  document.getElementById("Image6").src = "./images/5.jpg";
  document.getElementById("Image5").src = "./images/0.jpg";
  document.getElementById("Image1").src = "./images/4.jpg";
  document.getElementById("Image3").src = "./images/2.jpg";
  document.getElementById("Image4").src = "./images/1.jpg";
  document.getElementById("Image2").src = "./images/3.jpg";
  document.getElementById("Image7").src = "./images/6_cc.jpg";
  controller.jumpScene(9)
}

window.onload = function() {
  document.getElementById('common_box').style.display = 'block'
  document.getElementById('box1').style.display = 'block'
  document.getElementById('box2').style.display = 'block'
  document.getElementById('footer').style.display = 'block'
  document.getElementById('Arrow').addEventListener('click', () => {
    document.getElementById('vr').style.display = 'flex'
    document.getElementById('box1').style.display = 'none'
    document.getElementById('box2').style.display = 'none'
    document.getElementById('audio1').play()
    document.getElementById('footer').style.display = 'none'
  })
  var audio2;
  audio2 = document.getElementById('audio2');
  audio2.volume = 0.2;
  var combox = document.getElementById("common_box");
  var cli_on = document.getElementById("cli_on");
  var flag = true,
    timer = null,
    initime,
    r_len = 0;
  changeImage4()
  for (let i = 0; i < 7; i++) {
    document.getElementById('Image' + (i + 1)).addEventListener('click', () => {
      eval('changeImage' + i + '()')
    })
    console.log(document.getElementById('Image' + (i + 1)));
  }
  cli_on.onclick = function() {
    /*如果不需要动态效果，这两句足矣
            combox.style.right = flag?'-270px':0;
            flag = !flag;
            */
    clearTimeout(initime);
    //根据状态flag执开展开收缩
    if (flag) {
      r_len = 0;
      timer = setInterval(slideright, 10);
    } else {
      r_len = -200;
      timer = setInterval(slideleft, 10);
    }
  }
  //展开
  function slideright() {
    if (r_len <= -200) {
      clearInterval(timer);
      flag = !flag;
      return false;
    } else {
      r_len -= 5;
      combox.style.right = r_len + 'px';
    }
  }
  //收缩
  function slideleft() {
    if (r_len >= 0) {
      clearInterval(timer);
      flag = !flag;
      return false;
    } else {
      r_len += 5;
      combox.style.right = r_len + 'px';
    }
  }
  //加载后3秒页面自动收缩
  initime = setTimeout("cli_on.click()", 3000);

  function gotopageX() {
    document.getElementById('main').css.display = 'flex'
  }
}
