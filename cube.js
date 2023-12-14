import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth/window.innerHeight,
	0.1,
	1000
);
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
camera.lookAt(0,0,0);
orbit.update();

const clock = new THREE.Clock(true);

/* * * * * * *
 *  OBJECTS  *
 * * * * * * */
const cubeGeometry = new THREE.BoxGeometry( 2, 2, 2 );
const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);
const edgeLines = new THREE.LineSegments(
	cubeEdges,
	new THREE.LineBasicMaterial({color: 0xff0000})
);
const cubeMaterial = new THREE.MeshNormalMaterial( {  } );
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
cube.attach(edgeLines);
cube.position.set(0,0,0);


const grid = new THREE.GridHelper(15);

scene.add( cube );
scene.add( grid );


/* * * * * * *
 *  ROTATION *
 * * * * * * */
function rotation(obj) {
	obj.rotateX((scaleMax.x - obj.scale.x + .1)/100);
	obj.rotateY((scaleMax.y - obj.scale.y + .1)/75);
}


/* * * * * * *
 * 	SCALING  *
 * * * * * * */
const scaleMax = new THREE.Vector3(3,3,3);
const scaleMin = new THREE.Vector3(0.5,0.5,0.5);

function smoothScaleVector(scale) {
	let factor = scaleMax.x - scale.x;
	return new THREE.Vector3(
		(factor / 100),
		(factor / 100),
		(factor / 100));
}

let scaleUp = true;
function scaling(obj) {
	if (scaleUp) {
		obj.scale.add(smoothScaleVector(obj.scale));
		if (obj.scale.x >= scaleMax.x - .05) {
			scaleUp = false;
		}
	}
	else {
		obj.scale.add(smoothScaleVector(obj.scale).negate());
		if (obj.scale.x <= scaleMin.x + .05) {
			scaleUp = true;
		}
	}
}

/* * * * * * *
 * 	MOVEMENT *
 * * * * * * */
function movement(obj) {
	obj.position.set(
		(Math.tan(clock.getElapsedTime())),
		0,
		0
	);
}

function animateCube() {
	rotation(cube);
	scaling(cube);
	movement(cube);
	renderer.render( scene, camera );
}

renderer.setAnimationLoop(animateCube);
