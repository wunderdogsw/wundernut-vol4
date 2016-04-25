var blocks = {};
var pivot = new THREE.Group();

var width = 500;
var height = 500;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
camera.position.z = 6;


var renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var loader = new THREE.FontLoader();

loader.load( 'fonts/helvetiker_bold.typeface.js', function ( font ) {
    init(font);
});

var blockGeometry = new THREE.Geometry();
blockGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
blockGeometry.vertices.push(new THREE.Vector3(1, 0, 0));
blockGeometry.vertices.push(new THREE.Vector3(1, 1, 0));
blockGeometry.vertices.push(new THREE.Vector3(0, 1, 0));
blockGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

blockGeometry.vertices.push(new THREE.Vector3(0, 0, 1));
blockGeometry.vertices.push(new THREE.Vector3(0, 1, 1));
blockGeometry.vertices.push(new THREE.Vector3(1, 1, 1));
blockGeometry.vertices.push(new THREE.Vector3(1, 0, 1));
blockGeometry.vertices.push(new THREE.Vector3(0, 0, 1));

blockGeometry.vertices.push(new THREE.Vector3(1, 0, 1));
blockGeometry.vertices.push(new THREE.Vector3(1, 0, 0));
blockGeometry.vertices.push(new THREE.Vector3(1, 1, 0));
blockGeometry.vertices.push(new THREE.Vector3(1, 1, 1));
blockGeometry.vertices.push(new THREE.Vector3(0, 1, 1));
blockGeometry.vertices.push(new THREE.Vector3(0, 1, 0));

var neutral = 0xb6c857;

// ---------------
var init = function(font) {
    console.log('init');

    var createBlock = function(x, yi, z, letter) {
        var blockMaterial = new THREE.LineBasicMaterial({
            color: neutral,
            transparent: true,
            opacity: 0.8
        });

        var block = new THREE.Line(blockGeometry, blockMaterial);
        var y = 3 - yi;
        var xyz = "" + yi + z + x;
        block.name = xyz;
        block.add(letterMesh);
        block.translateX(x);
        block.translateY(y);
        block.translateZ(z);

        blocks[xyz] = block;

        var helper = new THREE.Object3D();
        helper.name = "letterTurnHelper";
        helper.translateX(0.5);
        helper.translateY(0.5);
        helper.translateZ(0.5);

        block.add(helper);

        var letterGeom = new THREE.TextGeometry(letter,
                                                {font: font,
                                                 size: 0.5,
                                                 weight: "bold",
                                                 height: 0.01});
        var letterMaterial = new THREE.MeshBasicMaterial({color: neutral});
        var letterMesh = new THREE.Mesh(letterGeom, letterMaterial);
        letterMesh.name = "letter";

        letterGeom.computeBoundingBox();
        var centerX = 0.5 * (letterGeom.boundingBox.max.x - letterGeom.boundingBox.min.x);
        var centerY = 0.5 * (letterGeom.boundingBox.max.y - letterGeom.boundingBox.min.y);
        letterMesh.translateX(-centerX);
        letterMesh.translateY(-centerY);

        helper.add(letterMesh);

        
        return block;
    };

    var cube = new THREE.Object3D();
    cube.translateX(-2);
    cube.translateY(-2);
    cube.translateZ(-2);

    // Create letter blocks
    var letterArray = ("AJFEAPUWOGMRMNXKDNSIFODSJEGIWKPR" +
                       "EQMFRKIDDMIREOSDRTSLDKPISPOIJQDT").split('');
    var letterCounter = 0;
    
    for (var y = 0; y < 4; y++) {
        for (var z = 0; z < 4; z++) {
            for (var x = 0; x < 4; x++) {
                var block = createBlock(x, y, z, letterArray[letterCounter]);
                letterCounter++;
                cube.add(block);
            }
        }
    }
    
    var box = new THREE.Box3().setFromObject( cube );
    box.center( cube.position ); // this re-sets the mesh position
    cube.position.multiplyScalar( -1 );

    scene.add( pivot );
    pivot.add( cube );

    cube.translateX(-2);
    cube.translateY(-2);
    cube.translateZ(-2);

    render();
};

// ---------------
function render() {
    requestAnimationFrame( render );

    pivot.rotation.y += 0.01;

    // Rotate letters to face camera
    for(var name in blocks) {
        var c = blocks[name];

        var wl = camera.position.clone();
        var helper = c.getObjectByName("letterTurnHelper");
        helper.parent.worldToLocal(wl)
        helper.lookAt(wl);
    }

    renderer.render( scene, camera );
}


var setBlockColor = function(block, r, g, b) {
    var curColor = block.material.color;
    var lColor = block.getObjectByName("letter").material.color;
    curColor.setRGB(r, g, b);
    lColor.setRGB(r, g, b);
};

var getBlockByName = function(name) {
    return blocks[name];
};

var resetColors = function() {
    for (var name in blocks) {
        var block = blocks[name];
        setBlockColor(block, 0.714, 0.784, 0.341);
    };
};
