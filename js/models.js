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
    }
};


var meshes = {};


function onResourcesLoaded() {

    //Buildings
    meshes["windmill"] = models.windmill.mesh.clone();
    meshes["windmill"].position.set(-2,2,-2);
    meshes["windmill"].scale.set(1,1,1);
    scene.add(meshes["windmill"]);

    meshes["tower"] = models.tower.mesh.clone();
    meshes["tower"].position.set(-3,0,2);
    meshes["tower"].scale.set(0.08,0.08,0.08);
    scene.add(meshes["tower"]);
    

    //Weapons
    meshes["machinegun"] = models.machinegun.mesh.clone();
    meshes["machinegun"].position.set(2,1,2);
    meshes["machinegun"].scale.set(10,10,10);
    scene.add(meshes["machinegun"]);

    meshes["flamethrower"] = models.flamethrower.mesh.clone();
    meshes["flamethrower"].position.set(2,1,0);
    meshes["flamethrower"].scale.set(10,10,10);
    scene.add(meshes["flamethrower"]);

    meshes["sniper"] = models.sniper.mesh.clone()
    meshes["sniper"].position.set(3,1,-2);
    meshes["sniper"].scale.set(10,10,10);
    scene.add(meshes["sniper"]);

}