//importing things
import * as THREE from 'three';
import { GTLFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as ace from 'ace-builds'
import * as darkTheme from 'ace-builds/src-noconflict/theme-one_dark'
import * as jsonMode from 'ace-builds/src-noconflict/mode-javascript.js'
import Popup from 'super-simple-popup';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const { MathUtils } = require("three");
const rightAngle = MathUtils.DEG2RAD * 90;
const axesToRotIndex = {
    "1,2": 3, "1,3": 0, "1,-2": 1, "1,-3": 2, "2,1": 5, "2,3": 16, "2,-1": 15, "2,-3": 24, "3,1": 6, "3,2": 25, "3,-1": 12, "3,-2": 17, "-1,2": 9, "-1,3": 10, "-1,-2": 11, "-1,-3": 8, "-2,1": 7, "-2,3": 26, "-2,-1": 13, "-2,-3": 18, "-3,1": 4, "-3,2": 19, "-3,-1": 14, "-3,-2": 27
}
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
document.getElementById('file').addEventListener("click", () => {
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
    document.querySelector('.popup-container>.popup-content>button').addEventListener("click", () => {
        folder = document.querySelector('.popup-container>.popup-content>input').files;
        temp.close()
        console.log(folder)
        window.f = folder
        uploadFolder();
    })
});
//setting up THREE.js 3D veiwer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, (window.innerWidth / 2) / ((window.innerHeight / 2) - 20), 0.1, 1000);
var model = [];
scene.background = new THREE.TextureLoader().load("assets/background.jpg");
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth / 2, (window.innerHeight / 2) - 20);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 10);
controls.update();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
//functions
function updateControls() {
    blueprint = JSON.parse(editor.getValue());
    document.querySelector('#controls>div').innerHTML = "";
    for (let i = 0; i < blueprint.bodies.length; i++) {
        for (let o = 0; o < blueprint.bodies[i].childs.length; o++) {
            const b = blueprint.bodies[i].childs[o];/*
                document.querySelector('#controls>div').innerHTML += `
                <h2>${blockCache[b.shapeId]}</h2>
                <hr>
                <h3>Color:</h3>
                <input type="color" value="#${b.color}" oninput="updateScript('color', ${i}, this.value)">
                <h3>Position</h3>
                ${b.pos}
                <p>
                    x<input type="number" value="${b.pos.x}">
                    y<input type="number" value="${b.pos.x}">
                    z<input type="number" value="${b.pos.x}">
                </p>
                `;*/
            if (b.bounds) {
                const geometry = new THREE.BoxGeometry(b.bounds.x, b.bounds.z, b.bounds.y);
                const material = new THREE.MeshBasicMaterial({ color: new THREE.Color("#" + b.color) });
                const cube = new THREE.Mesh(geometry, material);
                cube.geometry.translate(b.bounds.x / 2, b.bounds.z / 2, b.bounds.y / 2)
                cube.position.x = b.pos.x
                cube.position.z = b.pos.y
                cube.position.y = b.pos.z
                scene.add(cube);
            } else {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshBasicMaterial({ color: new THREE.Color("#" + b.color) });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.x = b.pos.x
                cube.position.z = b.pos.y
                cube.position.y = b.pos.z
                scene.add(cube);
            }

        }
    }
    /*for (let i = 0; i < blueprint.joints.length; i++) {
            const b = blueprint.joints[i];
                document.querySelector('#controls>div').innerHTML += `
                <h2>${blockCache[b.shapeId]}</h2>
                <hr>
                <h3>Color:</h3>
                <input type="color" value="#${b.color}" oninput="updateScript('color', ${i}, this.value)">
                <h3>Position</h3>
                <p>
                    x<input type="number" value="${b.pos.x}">
                    y<input type="number" value="${b.pos.x}">
                    z<input type="number" value="${b.pos.x}">
                </p>
                `
    }*/
}
window.updateScript = function (type, value, newValue) {
    if (type == "color") {
        blueprint.bodies[0].childs[value].color == newValue;
        console.log(blueprint.bodies[0].childs[value].color);
    }
}
function uploadFolder() {
    let allowed = {
        blueprint: false,
        icon: false,
        description: false
    };
    for (let i = 0; i < folder.length; i++) {
        const file = folder[i];
        if (file.name == "blueprint.json" || testing) {
            allowed.blueprint = true;
        };
        if (file.name == "icon.png" || testing) {
            allowed.icon = true;
        };
        if (file.name == "description.json" || testing) {
            allowed.description = true;
        };
    };
    if (allowed.blueprint && allowed.description && allowed.icon) {
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
                editor.setValue(beautify(blueprint, { format: "json" }));
                updateControls();
            }
        }
        return
    } else {
        new Popup({
            title: "Error parsing File",
            plainText: true,
            content: "there was and error parsing your folder, please make sure that you selected the correct folder." + `\nMissing Files:\n ${!allowed.blueprint ? "blueprint.json\n" : ""}${!allowed.description ? "description.json\n" : ""}${!allowed.icon ? "icon.png" : ""}`
        })
    }
}
var modelData = {
    "9f0f56e8-2c31-4d83-996c-d00a9b296c3f": "Logic Gate",
    "494f0a47-3f18-4ae1-bc42-3f0fccce4f43": "Spud Gun",
    "73f838db-783e-4a41-bc0f-9008967780f3": "Offroad Suspension (T5)",
    "9dd1ccea-1e44-430d-b706-3ff45416583e": "Drivers Saddle (T5)"
}
var blockCache = [{ "UUID": "a6c6ce30-dd47-4587-b475-085d55c6a3b4", "Name": "Concrete Block 1" }, { "UUID": "df953d9c-234f-4ac2-af5e-f0490b223e71", "Name": "Wood Block 1" }, { "UUID": "8aedf6c2-94e1-4506-89d4-a0227c552f1e", "Name": "Metal Block 1" }, { "UUID": "09ca2713-28ee-4119-9622-e85490034758", "Name": "Barrier Block" }, { "UUID": "8ca49bff-eeef-4b43-abd0-b527a567f1b7", "Name": "Tile Block" }, { "UUID": "0603b36e-0bdb-4828-b90c-ff19abcdfe34", "Name": "Brick Block" }, { "UUID": "5f41af56-df4c-4837-9b3c-10781335757f", "Name": "Glass Block" }, { "UUID": "749f69e0-56c9-488c-adf6-66c58531818f", "Name": "Glass Tile Block" }, { "UUID": "073f92af-f37e-4aff-96b3-d66284d5081c", "Name": "Path Light Block" }, { "UUID": "027bd4ec-b16d-47d2-8756-e18dc2af3eb6", "Name": "Spaceship Block" }, { "UUID": "f0cba95b-2dc4-4492-8fd9-36546a4cb5aa", "Name": "Cardboard Block" }, { "UUID": "1fc74a28-addb-451a-878d-c3c605d63811", "Name": "Scrap Wood Block" }, { "UUID": "1897ee42-0291-43e4-9645-8c5a5d310398", "Name": "Wood Block 2" }, { "UUID": "061b5d4b-0a6a-4212-b0ae-9e9681f1cbfb", "Name": "Wood Block 3" }, { "UUID": "1f7ac0bb-ad45-4246-9817-59bdf7f7ab39", "Name": "Scrap Metal Block" }, { "UUID": "1016cafc-9f6b-40c9-8713-9019d399783f", "Name": "Metal Block 2" }, { "UUID": "c0dfdea5-a39d-433a-b94a-299345a5df46", "Name": "Metal Block 3" }, { "UUID": "30a2288b-e88e-4a92-a916-1edbfc2b2dac", "Name": "Scrap Stone Block" }, { "UUID": "ff234e42-5da4-43cc-8893-940547c97882", "Name": "Concrete Block 2" }, { "UUID": "e281599c-2343-4c86-886e-b2c1444e8810", "Name": "Concrete Block 3" }, { "UUID": "f5ceb7e3-5576-41d2-82d2-29860cf6e20e", "Name": "Cracked Concrete Block" }, { "UUID": "cd0eff89-b693-40ee-bd4c-3500b23df44e", "Name": "Concrete Slab Block" }, { "UUID": "220b201e-aa40-4995-96c8-e6007af160de", "Name": "Rusted Metal Block" }, { "UUID": "25a5ffe7-11b1-4d3e-8d7a-48129cbaf05e", "Name": "Extruded Metal Block" }, { "UUID": "f406bf6e-9fd5-4aa0-97c1-0b3c2118198e", "Name": "Bubble Plastic Block" }, { "UUID": "628b2d61-5ceb-43e9-8334-a4135566df7a", "Name": "Plastic Block" }, { "UUID": "9be6047c-3d44-44db-b4b9-9bcf8a9aab20", "Name": "Insulation Block" }, { "UUID": "b145d9ae-4966-4af6-9497-8fca33f9aee3", "Name": "Plaster Block" }, { "UUID": "febce8a6-6c05-4e5d-803b-dfa930286944", "Name": "Carpet Block" }, { "UUID": "e981c337-1c8a-449c-8602-1dd990cbba3a", "Name": "Painted Wall Block" }, { "UUID": "4aa2a6f0-65a4-42e3-bf96-7dec62570e0b", "Name": "Net Block" }, { "UUID": "3d0b7a6e-5b40-474c-bbaf-efaa54890e6a", "Name": "Solid Net Block" }, { "UUID": "ea6864db-bb4f-4a89-b9ec-977849b6713a", "Name": "Punched Steel Block" }, { "UUID": "a479066d-4b03-46b5-8437-e99fec3f43ee", "Name": "Striped Net Block" }, { "UUID": "b4fa180c-2111-4339-b6fd-aed900b57093", "Name": "Square Mesh Block" }, { "UUID": "920b40c8-6dfc-42e7-84e1-d7e7e73128f6", "Name": "Restroom Block" }, { "UUID": "f7d4bfed-1093-49b9-be32-394c872a1ef4", "Name": "Diamond Plate Block" }, { "UUID": "3e3242e4-1791-4f70-8d1d-0ae9ba3ee94c", "Name": "Aluminum Block" }, { "UUID": "d740a27d-cc0f-4866-9e07-6a5c516ad719", "Name": "Worn Metal Block" }, { "UUID": "4ad97d49-c8a5-47f3-ace3-d56ba3affe50", "Name": "Spaceship Floor Block" }, { "UUID": "c56700d9-bbe5-4b17-95ed-cef05bd8be1b", "Name": "Sand Block" }, { "UUID": "b5ee5539-75a2-4fef-873b-ef7c9398b3f5", "Name": "Armored Glass Block" }]
window.temp = {};
for (let i = 0; i < blockCache.length; i++) {
    window.temp[blockCache[i].UUID] = blockCache[i].Name;
}
blockCache = window.temp;
blockCache["9f0f56e8-2c31-4d83-996c-d00a9b296c3f"] = "Logic Gate",
    blockCache["494f0a47-3f18-4ae1-bc42-3f0fccce4f43"] = "Spud Gun",
    blockCache["73f838db-783e-4a41-bc0f-9008967780f3"] = "Offroad Suspension (T5)",
    blockCache["9dd1ccea-1e44-430d-b706-3ff45416583e"] = "Drivers Saddle (T5)",

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