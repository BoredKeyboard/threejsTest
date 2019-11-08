var scene = new THREE.Scene();

var xSpeed = 0.1;
var ySpeed = 0.1;
var zSpeed = 0.1;
var scale = 1;
var mouseX = 0;
var mouseY = 0;
var player = {speed:0.075};
var shadowRes = 2048; //512 is default, recommended: 1024, 1536, 2048, 3072, 4096

var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.set(3,1,0);
camera.rotation.set(0,-67.5,0);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
})

var textureLoader = new THREE.TextureLoader();
crateTexture = new textureLoader.load("assets/crate0/crate0_diffuse.png");
crateBumpMap = new textureLoader.load("assets/crate0/crate0_bump.png");
crateNormalMap = new textureLoader.load("assets/crate0/crate0_normal.png");

var mtlLoader = new THREE.MTLLoader();

mtlLoader.setPath('assets/fantasy/Models/OBJ/');
mtlLoader.load('tree.mtl', function(materials){
    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('assets/fantasy/Models/OBJ/');
    objLoader.load('tree.obj', function(object) {
        object.position.set(-3,0,-2);
        scene.add(object);
    });
})



var cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({color: 0xFF4444})
);

cube.position.set(0,0.5,0);
cube.rotation.set(0,45,0);
cube.scale.set(1,1,1);
cube.receiveShadow = true;
cube.castShadow = true;
scene.add(cube);

var crate = new THREE.Mesh(
    new THREE.BoxGeometry(2,2,2),
    new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        map: crateTexture,
        bumpMap: crateBumpMap,
        normalMap: crateNormalMap
    })
);

crate.position.set(0,1,2.25);
crate.receiveShadow = true;
crate.castShadow = true;
scene.add(crate);

var ambLight = new THREE.AmbientLight(0x404040, 0.5);
//ambLight.castShadow = true;
scene.add(ambLight);

var light = new THREE.PointLight(0xFFFFFF, 1, 500)
light.position.set(3,6,-3);
light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 25;
light.shadowMapWidth = shadowRes;
light.shadowMapHeight = shadowRes;
scene.add(light);

var floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10,10,10,10),
    new THREE.MeshPhongMaterial({color:0xFFFFFF, wireframe:false})
);
floor.rotation.x -= Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);



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
    renderer.render(scene, camera);

    crate.rotation.y += 0.025;

    //up, SPACE
    if (keyIsDown(32)) {
        camera.position.y += player.speed;
    }
    //down, SHIFT
    if (keyIsDown(16)) {
        camera.position.y -= player.speed;
    }
    //left, A
    if (keyIsDown(65)) {
        camera.position.x += -Math.cos(camera.rotation.y) * player.speed;
        camera.position.z += Math.sin(camera.rotation.y) * player.speed;
    }
    //right, D
    if (keyIsDown(68)) {
        camera.position.x += Math.cos(camera.rotation.y) * player.speed;
        camera.position.z += -Math.sin(camera.rotation.y) * player.speed;
    }
    //forward, W
    if (keyIsDown(87)) {
        camera.position.x += -Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    //backward, S
    if (keyIsDown(83)) {
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += Math.cos(camera.rotation.y) * player.speed;
    }
    //enter, reset position
    if (keyIsDown(13)) {
        camera.position.set(3,1,0);
        camera.rotation.set(0,-67.5,0);
    }

}

render();