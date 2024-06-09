// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-scene').appendChild(renderer.domElement);

// Add a light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

// Create the ground
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Load the GLTF model
const loader = new THREE.GLTFLoader();
let character;
let mixer;
loader.load('character.glb', function(gltf) {
    character = gltf.scene;
    character.position.y = 0.5;
    scene.add(character);

    // Set up animations
    mixer = new THREE.AnimationMixer(character);
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });
}, undefined, function(error) {
    console.error(error);
});

// Set camera position
camera.position.z = 5;

// Animate the scene
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);

    // Update the character position
    if (character) {
        character.position.x += 0.05;
        if (character.position.x > 50) character.position.x = -50;
    }

    // Update the animation mixer
    if (mixer) {
        mixer.update(clock.getDelta());
    }

    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
