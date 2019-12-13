var models = {
    machinegun: {
        obj: "assets/weaponPack/Models/machinegun.obj",
        mtl: "assets/weaponPack/Models/machinegun.mtl",
        meh: null,
        castShadow: false
    },
    flamethrower: {
        obj: "assets/weaponPack/Models/flamethrower.obj",
        mtl: "assets/weaponPack/Models/flamethrower.mtl",
        mesh: null,
        castShadow: false
    },
    windmill: {
        obj: "assets/fantasy/Models/Models/windmill.obj",
        mtl: "assets/fantasy/Models/Models/windmill.mtl",
        mesh: null,
        castShadow: false
    },
    tower: {
        mtl: "assets/pirate/Models/Models/tower.mtl",
        obj: "assets/pirate/Models/Models/tower.obj",
        mesh: null,
        castShadow: true
    },
    sniper: {
        obj: "assets/weaponPack/Models/sniper.obj",
        mtl: "assets/weaponPack/Models/sniper.mtl",
        mesh: null,
        castShadow: false
    },
    pistol: {
        obj: "assets/weaponPack/Models/pistol.obj",
        mtl: "assets/weaponPack/Models/pistol.mtl",
        mesh: null,
        castShadow: false
    },
    shotgun: {
        obj: "assets/weaponPack/Models/shotgun.obj",
        mtl: "assets/weaponPack/Models/shotgun.mtl",
        mesh: null,
        castShadow: false
    }
};

var meshes = {};

var bullets = [];

var visibility = false;

function onResourcesLoaded() {

    //Buildings
    meshes["windmill"] = models.windmill.mesh.clone();
    meshes["windmill"].position.set(-2,2,-2);
    meshes["windmill"].scale.set(1,1,1);
    scene.add(meshes["windmill"]);

    meshes["tower"] = models.tower.mesh.clone();
    meshes["tower"].position.set(-4,0,8);
    meshes["tower"].scale.set(0.16,0.13,0.16);
    //meshes["tower"].visible = false;
    scene.add(meshes["tower"]);
    

    //Weapons
    meshes["machinegun"] = models.machinegun.mesh.clone();
    meshes["machinegun"].position.set(2,1,2);
    meshes["machinegun"].scale.set(10,10,10);
    meshes["machinegun"].visible = visibility;
    scene.add(meshes["machinegun"]);

    meshes["flamethrower"] = models.flamethrower.mesh.clone();
    meshes["flamethrower"].position.set(2,1,0);
    meshes["flamethrower"].scale.set(10,10,10);
    meshes["flamethrower"].visible = visibility;
    scene.add(meshes["flamethrower"]);

    meshes["sniper"] = models.sniper.mesh.clone()
    meshes["sniper"].position.set(3,1,-2);
    meshes["sniper"].scale.set(10,10,10);
    meshes["sniper"].visible = visibility;
    scene.add(meshes["sniper"]);

    meshes["pistol"] = models.pistol.mesh.clone()
    meshes["pistol"].position.set(3,1,-4);
    meshes["pistol"].scale.set(7,7,7);
    meshes["pistol"].visible = visibility;
    scene.add(meshes["pistol"]);

    meshes["shotgun"] = models.shotgun.mesh.clone()
    meshes["shotgun"].position.set(3,1,-2);
    meshes["shotgun"].scale.set(10,10,10);
    meshes["shotgun"].visible = visibility;
    scene.add(meshes["shotgun"]);

}