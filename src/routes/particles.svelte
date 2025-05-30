<script lang="ts">
	import type { GUI } from 'dat.gui';
	import * as THREE from 'three';

	const render = (canvas: HTMLCanvasElement) => {
		let gui: GUI;

		import('dat.gui').then(({ GUI }) => {
			// GUI
			gui = new GUI();

			const cameraFolder = gui.addFolder('Camera');
			cameraFolder.add(camera.position, 'z', -10, 100).name('Position Z');
			cameraFolder.open();

			const lightFolder = gui.addFolder('Light');
			lightFolder.add(skylight.position, 'x', -10, 100).name('Light X');
			lightFolder.add(skylight.position, 'y', -10, 100).name('Light Y');
			lightFolder.add(skylight.position, 'z', -10, 100).name('Light Z');
			lightFolder.open();
		});

		const width = window.innerWidth;
		const height = window.innerHeight;
		const scale = window.devicePixelRatio;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		camera.position.z = 5;

		const renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true,
			alpha: true
		});

		renderer.setClearColor(0x000000, 0);
		renderer.setSize(width, height);
		renderer.setPixelRatio(scale);

		// LIGHT
		const light = new THREE.AmbientLight(0xffffff, 0.2);
		scene.add(light);

		const skylight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
		skylight.position.set(0, -1, 4);
		scene.add(skylight);

		const skylightHelper = new THREE.HemisphereLightHelper(skylight, 0.5);
		scene.add(skylightHelper);

		// CUBE
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		const target = cube.position.clone();
		camera.lookAt(target);

		function animate() {
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			renderer.render(scene, camera);
		}

		renderer.setAnimationLoop(animate);

		return () => {
			renderer.dispose();
			scene.clear();
			gui?.destroy();
		};
	};
</script>

<canvas class="h-screen w-screen" {@attach render}></canvas>
