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
//setting up ace code editor
const editor = ace.edit('editor');
editor.setTheme(darkTheme);
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
        uploadFolder();
    })
});
//setting up THREE.js 3D veiwer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, (window.innerWidth / 2) / ((window.innerHeight / 2 ) - 20), 0.1, 1000 );

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
function uploadFolder () {
    let allowed = false;
    for (let i = 0; i < folder.length; i++) {
        const file = folder[i];
        if (file.name == "blueprint.json" || testing){
            allowed = true;
        };
    };
    if (allowed){
        return
    }else{
        new Popup ({
            title:"Error parsing File",
            plainText: true,
            content: "there was and error parsing your folder, please make sure that it includes a blueprint.json file."
        })
    }
}