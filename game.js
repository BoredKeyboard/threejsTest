var scene = new THREE.Scene();
    
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.set(0,1,4);  

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
})


var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
var mesh = new THREE.Mesh(geometry, material);

mesh.position.set(0,0,0);
mesh.rotation.set(45,45,0);
mesh.scale.set(1,1,1);

scene.add(mesh);

var ambLight = new THREE.AmbientLight(0x404040);
scene.add(ambLight);

var light = new THREE.PointLight(0xFFFFFF, 1, 500)
light.position.set(10,0,25);
scene.add(light);

var xSpeed = 0.1;
var ySpeed = 0.1;
var zSpeed = 0.1;
var scale = 1;
var mouseX = 0;
var mouseY = 0;


document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);

const downKeys = [];

function onDocumentKeyDown(event) {
  if (!keyIsDown(event.which)) {
    downKeys.push(event.which);
  } 
}

function onDocumentKeyUp(event) {
    const index = downKeys.indexOf(event.which);
    if (index != -1) {
        downKeys.splice(index,1);
    }
}

function keyIsDown(keyCode) {
  return downKeys.indexOf(keyCode) != -1;
}

camera.rotation.order = "YXZ";

document.addEventListener( "mousemove", mouseMove, false );

renderer.domElement.addEventListener("click", function () {
    renderer.domElement.requestPointerLock();
}, false);
renderer.domElement.addEventListener("mousemove", mouseMove, false);

function mouseMove(event) {
    if (document.pointerLockElement){
        camera.rotation.y -= (event.movementX / renderer.domElement.clientWidth) * 2 / scale;
        camera.rotation.x -= (event.movementY / renderer.domElement.clientHeight) * 2 / scale;
    } else {
        mouseX = -(event.clientX / renderer.domElement.clientWidth) * 2 + 1;
        mouseY = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        camera.rotation.x = mouseY / scale;
        camera.rotation.y = mouseX / scale;
    }
}

var render = function() {
    requestAnimationFrame(render);
    mesh.rotation.set(0,0,0);
    renderer.render(scene, camera);

    //up, SPACE
    if (keyIsDown(32)) {
        mesh.position.y -= ySpeed;
    }
    //down, CTRL
    else if (keyIsDown(17)) {
        mesh.position.y += ySpeed;
    }
    //left, A
    else if (keyIsDown(65)) {
        mesh.position.x += xSpeed;
    }
    //right, D
    else if (keyIsDown(68)) {
        mesh.position.x -= xSpeed;
    }
    //forward, W
     else if (keyIsDown(87)) {
        mesh.position.z += zSpeed;
    }
    //backward, S
    else if (keyIsDown(83)) {
        mesh.position.z -= zSpeed;
    }
    //enter, reset position
    else if (keyIsDown(13)) {
        mesh.position.x = 0.0;
        mesh.position.y = 0.0;
        mesh.position.z = 0.0;
    }

}

render();
