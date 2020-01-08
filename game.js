var scene = new THREE.Scene();
var clock = new THREE.Clock();
var xSpeed = 0.1;
var ySpeed = 0.1;
var zSpeed = 0.1;
var scale = 2.2;
var mouseX = 0;
var mouseY = 0;
var fireRate = 20;
var player = {speed:0.05, canShoot:fireRate };
var shadowRes = 512; //512 is default, recommended: 1024, 1536, 2048, 3072, 4096
var audio = new Audio("audio/moonTheme.mp3")
var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(200,window.innerWidth/window.innerHeight,0.1,100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5,0.5,0.5),
        new THREE.MeshBasicMaterial({ color:0xac0000 })
    )
};

var mouseDown = false;
window.addEventListener("mousedown", function(){
    mouseDown = true;
});
window.addEventListener("mouseup", function(){
    mouseDown = false;
});


var playerWeapon = "pistol";

var LOADING_MANAGER = null;
var RESOURCES_LOADED = false; 

var renderer = new THREE.WebGLRenderer({antialias: true});
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

function init(){
    
    audio.play();

    var time = Date.now() * 0.0005;
	var delta = clock.getDelta();
    
    camera.position.set(6,1.25,0);
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
 
    var textureLoader = new THREE.TextureLoader(loadingManager);

    //renderer.setClearColor("#000000");
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
    })

    var cubeMaterials = 
    [
        new THREE.MeshBasicMaterial( { map: textureLoader.load("assets/sor_cwd/cwd_bk.JPG"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial( { map: textureLoader.load("assets/sor_cwd/cwd_bk.JPG"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial( { map: textureLoader.load("assets/sor_cwd/cwd_dn.JPG"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial( { map: textureLoader.load("assets/sor_cwd/cwd_dn.JPG"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial( { map: textureLoader.load("assets/sor_cwd/cwd_rt.JPG"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial( { map: textureLoader.load("assets/sor_cwd/cwd_lf.JPG"), side: THREE.DoubleSide})
    ];

    var skyBox = new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000 ), new THREE.MeshFaceMaterial( cubeMaterials ));
    scene.add(skyBox);

    var playerBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.SingleSide}) );
    scene.add(playerBox);

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
            //camera.rotation.x -= (event.movementY / renderer.domElement.clientHeight) * 2 / scale;//
        } else {
            //mouseX = -(event.clientX / renderer.domElement.clientWidth) * 2 + 1;//
            mouseY = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

            //camera.rotation.x = mouseY / scale;//
            camera.rotation.y = mouseX / scale;
        }
    }

    var render = function() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        //pyramid.rotation.y += 0.025;
        crate.rotation.y += 0.005;

        skyBox.position.set(
            camera.position.x,
            camera.position.y,
            camera.position.z
        );
        playerBox.position.set(
            camera.position.x,
            camera.position.y - 0.625,
            camera.position.z
        );

        for(var index=0; index<bullets.length; index+=1) {
            if( bullets[index] === undefined ) continue;
            if( bullets[index].alive == false ){
                bullets.splice(index,1);
                continue;
            }
            bullets[index].position.add(bullets[index].velocity);
        };

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
            camera.position.y = 1.25;
            //camera.rotation.set(0,-67.5,0);
        }

        //Weapon switch
        //1
        if (keyIsDown(49)) {
            meshes[playerWeapon].visible = false;
            playerWeapon = "pistol";
            fireRate = 20;
        }
        
        //2
        if (keyIsDown(50)) {
            meshes[playerWeapon].visible = false;
            playerWeapon = "machinegun";
            fireRate = 8;
        }

        //3
        if (keyIsDown(51)) {
            meshes[playerWeapon].visible = false;
            playerWeapon = "flamethrower";
            fireRate = 15;
        }

        //4
        if (keyIsDown(52)) {
            meshes[playerWeapon].visible = false;
            playerWeapon = "sniper";
            fireRate = 75;
        }

        //5
        if (keyIsDown(53)) {
            meshes[playerWeapon].visible = false;
            playerWeapon = "shotgun";
            fireRate = 50;
            console.log(fireRate);
        }
        
        //Shoot weapon
        if (mouseDown && player.canShoot <= 0) {
            console.log("down")
            var bullet = new THREE.Mesh(
                new THREE.SphereGeometry(0.025,8,8),
                new THREE.MeshBasicMaterial({color:0xffffff})
            );

            bullet.position.set(
                meshes[playerWeapon].position.x,
                meshes[playerWeapon].position.y + 0.08,
                meshes[playerWeapon].position.z
            );

            bullet.velocity = new THREE.Vector3(
                -Math.sin(camera.rotation.y),
                0,
                -Math.cos(camera.rotation.y)
            );

            bullet.alive = true;
            setTimeout(function(){
                bullet.alive = false;
                scene.remove(bullet);
            }, 1000);

            bullets.push(bullet);
            scene.add(bullet);
            //fireRate = 100;
            player.canShoot = fireRate;

        }
        


        
        if (player.canShoot > 0) player.canShoot -= 1;
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
    meshes["windmill"].rotation.x -= 0.075;
    meshes["man"].rotation.x -= 0.05;
    meshes["man"].rotation.y -= 0.1;
    meshes["man"].rotation.z -= 0.2;
    meshes["man"].position.y += 0.01;

    meshes[playerWeapon].visible = true;
    meshes[playerWeapon].rotation.set(
        camera.rotation.x,
        camera.rotation.y - Math.PI,
        camera.rotation.z
    );
    meshes[playerWeapon].position.set(
        camera.position.x - Math.sin(camera.rotation.y - Math.PI/6) * 0.65,
        camera.position.y - 0.35,
        camera.position.z - Math.cos(camera.rotation.y - Math.PI/6) * 0.65
    );
    
    requestAnimationFrame(animate);

}

window.onload = init;