//importing things
import * as THREE from 'three'
import * as ace from 'ace-builds'
import * as darkTheme from 'ace-builds/src-noconflict/theme-one_dark'
import * as jsonMode from 'ace-builds/src-noconflict/mode-javascript.js'
import Popup from 'super-simple-popup'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
jsonMode.jsonModeType = jsonMode.Mode;
//setting variables
var folder;
const testing = false;
const reader = new FileReader();
const beautify = require('beautify');
var blueprint = {};
//setting up ace code editor
const editor = ace.edit('editor');
editor.setTheme(darkTheme);
editor.setReadOnly(true)
editor.session.setMode(new jsonMode.jsonModeType());
editor.setShowPrintMargin(false)
editor.commands.addCommand({
    name: 'word wrap',
    bindKey: { win: 'Alt-Z', mac: 'Alt-Z' },
    exec: function (editor) {
        editor.session.setUseWrapMode(!editor.session.$useWrapMode);
    },
    readOnly: true
});
//setting up header & popup
document.getElementById('file').addEventListener("click", ()=>{
    let temp = new Popup({
        title: 'Open Blueprint Folder',
           plainText: false,
           content: `<p>Upload the folder of the blueprint you would like to edit
           To find this folder goto: <code>User\\AppData\\Roaming\\Axolot Games\\Scrap Mechanic\\User\\User####\\Blueprints</code>
           Then sort by date modified to get the most recent one</p>
           <input type="file" webkitdirectory>
           <button>OK</button> 
           `
    });
    document.querySelector('.popup-container>.popup-content>button').addEventListener("click", ()=> {
        folder = document.querySelector('.popup-container>.popup-content>input').files;
        temp.close() 
        console.log(folder)
        window.f = folder
        uploadFolder();
    })
});
//setting up THREE.js 3D veiwer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, (window.innerWidth / 2) / ((window.innerHeight / 2 ) - 20), 0.1, 1000 );
var model = [];
scene.background = new THREE.TextureLoader().load( "assets/background.jpg" );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth / 2, (window.innerHeight / 2 ) - 20);
document.body.appendChild( renderer.domElement );
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 5;
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 2, 10 );
controls.update();
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
//functions
function updateControls () {
    blueprint = JSON.parse(editor.getValue())
    console.log(modelData)
    document.querySelector('#controls>div').innerHTML = "";
    for (let i = 0; i < blueprint.bodies[0].childs.length; i++) {
        const b = blueprint.bodies[0].childs[i];
        document.querySelector('#controls>div').innerHTML += `
        <h2>${modelData[b.shapeId]}</h2>
        <hr>
        <h3>Color:</h3>
        <input type="color" value="#${b.color}" oninput="updateScript('color', ${i}, this.value)">
        `
    }
}
window.updateScript = function(type, value, newValue){
    if(type=="color"){
        blueprint.bodies[0].childs[value].color == newValue;
        console.log(blueprint.bodies[0].childs[value].color)
        //editor.setValue(beautify(JSON.stringify(blueprint), {format: 'json'}))
    }
}
function uploadFolder () {
    let allowed = {
        blueprint: false,
        icon: false,
        description: false
    };
    for (let i = 0; i < folder.length; i++) {
        const file = folder[i];
        if (file.name == "blueprint.json" || testing){
            allowed.blueprint = true;
        };
        if (file.name == "icon.png" || testing){
            allowed.icon = true;
        };
        if (file.name == "description.json" || testing){
            allowed.description = true;
        };
    };
    if (allowed.blueprint && allowed.description && allowed.icon){
        reader.readAsText(folder[1]);
        reader.onloadend = () => {
            let description = reader.result;
            description = JSON.parse(description)
            document.querySelector('.header>p').innerHTML = `${description.name} - Scrap Mechanic Blueprint`;
            document.querySelector('.header>p').title = `${description.type} | ${description.description}`;
            reader.readAsText(folder[0]);
            reader.onloadend = () => {
                var blueprint = reader.result;
                window.b = blueprint;
                editor.setValue(beautify(blueprint, {format:"json"}));
                updateControls();
            }
        }
        return
    }else{
        new Popup ({
            title:"Error parsing File",
            plainText: true,
            content: "there was and error parsing your folder, please make sure that you selected the correct folder." + `\nMissing Files:\n ${!allowed.blueprint? "blueprint.json\n" : ""}${!allowed.description? "description.json\n" : ""}${!allowed.icon? "icon.png" : ""}`
        })
    }
}
var modelData = {
    "9f0f56e8-2c31-4d83-996c-d00a9b296c3f" : "Logic Gate",
    "494f0a47-3f18-4ae1-bc42-3f0fccce4f43" : "Spud Gun"
}
editor.setValue(`
{
    "bodies": [{
        "childs": [{
                "color": "222222",
                "controller": {
                    "active": false,
                    "controllers": [{
                            "id": 21567
                        },
                        {
                            "id": 21568
                        },
                        {
                            "id": 21569
                        },
                        {
                            "id": 21570
                        },
                        {
                            "id": 21571
                        },
                        {
                            "id": 21572
                        },
                        {
                            "id": 21573
                        },
                        {
                            "id": 21574
                        },
                        {
                            "id": 21575
                        },
                        {
                            "id": 21576
                        },
                        {
                            "id": 21577
                        }
                    ],
                    "id": 21566,
                    "joints": null,
                    "mode": 0
                },
                "pos": {
                    "x": 15,
                    "y": -1,
                    "z": 3
                },
                "shapeId": "9f0f56e8-2c31-4d83-996c-d00a9b296c3f",
                "xaxis": 2,
                "zaxis": 1
            },
            {
                "color": "EEEEEE",
                "controller": {
                    "containers": null,
                    "controllers": null,
                    "id": 21567,
                    "joints": null
                },
                "pos": {
                    "x": 16,
                    "y": 0,
                    "z": 3
                },
                "shapeId": "494f0a47-3f18-4ae1-bc42-3f0fccce4f43",
                "xaxis": -1,
                "zaxis": 2
            },
            {
                "color": "EEEEEE",
                "controller": {
                    "containers": null,
                    "controllers": null,
                    "id": 21568,
                    "joints": null
                },
                "pos": {
                    "x": 16,
                    "y": 0,
                    "z": 3
                },
                "shapeId": "494f0a47-3f18-4ae1-bc42-3f0fccce4f43",
                "xaxis": -1,
                "zaxis": 2
            },
            {
                "color": "EEEEEE",
                "controller": {
                    "containers": null,
                    "controllers": null,
                    "id": 21569,
                    "joints": null
                },
                "pos": {
                    "x": 16,
                    "y": 0,
                    "z": 3
                },
                "shapeId": "494f0a47-3f18-4ae1-bc42-3f0fccce4f43",
                "xaxis": -1,
                "zaxis": 2
            },
            {
                "color": "EEEEEE",
                "controller": {
                    "containers": null,
                    "controllers": null,
                    "id": 21570,
                    "joints": null
                },
                "pos": {
                    "x": 16,
                    "y": 0,
                    "z": 3
                },
                "shapeId": "494f0a47-3f18-4ae1-bc42-3f0fccce4f43",
                "xaxis": -1,
                "zaxis": 2
            },
            {
                "color": "EEEEEE",
                "controller": {
                    "containers": null,
                    "controllers": null,
                    "id": 21571,
                    "joints": null
                },
                "pos": {
                    "x": 16,
                    "y": 0,
                    "z": 3
                },
                "shapeId": "494f0a47-3f18-4ae1-bc42-3f0fccce4f43",
                "xaxis": -1,
                "zaxis": 2
            },
            {
                "color": "EEEEEE",
                "controller": {
                    "containers": null,
                    "controllers": null,
                    "id": 21572,
                    "joints": null
                },
                "pos": {
                    "x": 16,
                    "y": 0,
                    "z": 3
                },
                "shapeId": "494f0a47-3f18-4ae1-bc42-3f0fccce4f43",
                "xaxis": -1,
                "zaxis": 2
            },
            {
                "color": "EEEEEE",
                "controller": {
                    "containers": null,
                    "controllers": null,
                    "id": 21573,
                    "joints": null
                },
                "pos": {
                    "x": 16,
                    "y": 0,
                    "z": 3
                },
                "shapeId": "494f0a47-3f18-4ae1-bc42-3f0fccce4f43",
                "xaxis": -1,
                "zaxis": 2
            },
            {
                "color": "EEEEEE",
                "controller": {
                    "containers": null,
                    "controllers": null,
                    "id": 21574,
                    "joints": null
                },
                "pos": {
                    "x": 16,
                    "y": 0,
                    "z": 3
                },
                "shapeId": "494f0a47-3f18-4ae1-bc42-3f0fccce4f43",
                "xaxis": -1,
                "zaxis": 2
            },
            {
                "color": "EEEEEE",
                "controller": {
                    "containers": null,
                    "controllers": null,
                    "id": 21575,
                    "joints": null
                },
                "pos": {
                    "x": 16,
                    "y": 0,
                    "z": 3
                },
                "shapeId": "494f0a47-3f18-4ae1-bc42-3f0fccce4f43",
                "xaxis": -1,
                "zaxis": 2
            },
            {
                "color": "EEEEEE",
                "controller": {
                    "containers": null,
                    "controllers": null,
                    "id": 21576,
                    "joints": null
                },
                "pos": {
                    "x": 16,
                    "y": 0,
                    "z": 3
                },
                "shapeId": "494f0a47-3f18-4ae1-bc42-3f0fccce4f43",
                "xaxis": -1,
                "zaxis": 2
            },
            {
                "color": "EEEEEE",
                "controller": {
                    "containers": null,
                    "controllers": null,
                    "id": 21577,
                    "joints": null
                },
                "pos": {
                    "x": 16,
                    "y": 0,
                    "z": 3
                },
                "shapeId": "494f0a47-3f18-4ae1-bc42-3f0fccce4f43",
                "xaxis": -1,
                "zaxis": 2
            },
            {
                "color": "222222",
                "controller": {
                    "active": false,
                    "controllers": null,
                    "id": 21580,
                    "joints": null,
                    "mode": 0
                },
                "pos": {
                    "x": 16,
                    "y": -1,
                    "z": 3
                },
                "shapeId": "9f0f56e8-2c31-4d83-996c-d00a9b296c3f",
                "xaxis": -1,
                "zaxis": 3
            },
            {
                "color": "800000",
                "controller": {
                    "containers": null,
                    "controllers": [{
                        "id": 21580
                    }],
                    "id": 21581,
                    "joints": null
                },
                "pos": {
                    "x": 15,
                    "y": 1,
                    "z": 3
                },
                "shapeId": "c7a99aa6-c5a4-43ad-84c9-c85f7d842a93",
                "xaxis": 3,
                "zaxis": 2
            }
        ]
    }],
    "dependencies": [{
        "contentId": "b7443f95-67b7-4f1e-82f4-9bef0c62c4b3",
        "name": "The Modpack Continuation",
        "shapeIds": [
            "494f0a47-3f18-4ae1-bc42-3f0fccce4f43",
            "c7a99aa6-c5a4-43ad-84c9-c85f7d842a93"
        ],
        "steamFileId": 2448492759
    }],
    "version": 4
}`)
updateControls();