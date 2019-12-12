var scene = new THREE.Scene();
var clock = new THREE.Clock();
var xSpeed = 0.1;
var ySpeed = 0.1;
var zSpeed = 0.1;
var scale = 2.2;
var mouseX = 0;
var mouseY = 0;
var player = {speed:0.05};
var shadowRes = 2048; //512 is default, recommended: 1024, 1536, 2048, 3072, 4096
var renderer = new THREE.WebGLRenderer({antialias: true});
var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(200,window.innerWidth/window.innerHeight,0.1,100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5,0.5,0.5),
        new THREE.MeshBasicMaterial({ color:0xac0000 })
    )
};

var playerWeapon = "pistol";

var LOADING_MANAGER = null;
var RESOURCES_LOADED = false; 

var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

function init(){
    
    var time = Date.now() * 0.0005;
	var delta = clock.getDelta();
    
    camera.position.set(6,1,0);
    camera.rotation.set(0,-67.5,0);

    loadingScreen.box.position.set(0,0,0.5);
    loadingScreen.camera.lookAt(loadingScreen.box.position);
    loadingScreen.scene.add(loadingScreen.box);
    
    loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = function(item, loaded, total){
        console.log(item, loaded, total);
    };

    loadingManager.onLoad = function(){
        console.log("All resources loaded.");
        RESOURCES_LOADED = true;
        onResourcesLoaded();
    };
 
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

    for( var _key in models){
        (function(key){
            var mtlLoader = new THREE.MTLLoader(loadingManager);
            mtlLoader.load(models[key].mtl, function(materials){
                materials.preload();
                var objLoader = new THREE.OBJLoader(loadingManager);
                objLoader.setMaterials(materials);
                objLoader.load(models[key].obj, function(mesh){
                    mesh.traverse(function(node) {
                        if( node instanceof THREE.Mesh ){
							if('castShadow' in models[key])
								node.castShadow = models[key].castShadow;
							else
								node.castShadow = true;
							
							if('receiveShadow' in models[key])
								node.receiveShadow = models[key].receiveShadow;
							else
								node.receiveShadow = true;
						}
                    });
                    models[key].mesh = mesh;
                });
            });

        })(_key);
    }

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

    var textureLoader = new THREE.TextureLoader(loadingManager);
    crateTexture = textureLoader.load("assets/crate0/crate0_diffuse.png");
    crateBumpMap = textureLoader.load("assets/crate0/crate0_bump.png");
    crateNormalMap = textureLoader.load("assets/crate0/crate0_normal.png");

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

    /*
    var pyramid = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 1, 1, 4, 1),
        new THREE.MeshNormalMaterial()
    );
    pyramid.position.set(2,2,-2);
    scene.add(pyramid);
    */

    var floor = new THREE.Mesh(
        new THREE.PlaneGeometry(40,40,40,40),
        new THREE.MeshPhongMaterial({color:0x5f5f5f, wireframe:false})
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
            //camera.rotation.x -= (event.movementY / renderer.domElement.clientHeight) * 2 / scale;
        } else {
            //mouseX = -(event.clientX / renderer.domElement.clientWidth) * 2 + 1;
            mouseY = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

            //camera.rotation.x = mouseY / scale;
            camera.rotation.y = mouseX / scale;
        }
    }

    var render = function() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        //pyramid.rotation.y += 0.025;
        crate.rotation.y += 0.005;

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
            camera.position.y = 1;
            //camera.rotation.set(0,-67.5,0);
        }


        //Weapon switch

        //1
        if (keyIsDown(49)) {
            meshes[playerWeapon].visible = false;
            playerWeapon = "pistol";
        }
        
        //2
        if (keyIsDown(50)) {
            meshes[playerWeapon].visible = false;
            playerWeapon = "machinegun";
        }

        //3
        if (keyIsDown(51)) {
            meshes[playerWeapon].visible = false;
            playerWeapon = "flamethrower";
        }

        //4
        if (keyIsDown(52)) {
            meshes[playerWeapon].visible = false;
            playerWeapon = "sniper";
        }

        //5
        if (keyIsDown(53)) {
            meshes[playerWeapon].visible = false;
            playerWeapon = "shotgun";
        }

    }

    render();
    animate();

}

function animate(){
    if( RESOURCES_LOADED == false){
        requestAnimationFrame(animate);

        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return;
    }
    meshes[playerWeapon].visible = true;
    meshes[playerWeapon].position.set(
        camera.position.x - Math.sin(camera.rotation.y - Math.PI/6) * 0.65,
        camera.position.y - 0.35,
        camera.position.z - Math.cos(camera.rotation.y - Math.PI/6) * 0.65
    );
    meshes[playerWeapon].rotation.set(
        camera.rotation.x,
        camera.rotation.y - Math.PI,
        camera.rotation.z
    );

    requestAnimationFrame(animate);

}

window.onload = init;