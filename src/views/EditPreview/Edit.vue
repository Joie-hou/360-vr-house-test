<template>
  <div id="edit-container" ref="view2D" class="edit-container">
    <div class="btn">
      <el-button class="action-btn" type="danger" :disabled="isClose" @click="actionClose">close</el-button>
      <el-button class="action-btn" type="success" :disabled="!isClose" @click="actionOpen">open</el-button>
    </div>
    <div class="cube-container">{{ cube }}</div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import gsap from "gsap";

import bedL from "@/assets/imgs/bedroom/23_l.jpg";
import bedR from "@/assets/imgs/bedroom/23_r.jpg";
import bedU from "@/assets/imgs/bedroom/23_u.jpg";
import bedD from "@/assets/imgs/bedroom/23_d.jpg";
import bedF from "@/assets/imgs/bedroom/23_f.jpg";
import bedB from "@/assets/imgs/bedroom/23_b.jpg";

import liveL from "@/assets/imgs/living/4_l.jpg";
import liveR from "@/assets/imgs/living/4_r.jpg";
import liveF from "@/assets/imgs/living/4_f.jpg";
import liveB from "@/assets/imgs/living/4_b.jpg";
import liveU from "@/assets/imgs/living/4_u.jpg";
import liveD from "@/assets/imgs/living/4_d.jpg";

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls;
const textureLoader = new THREE.TextureLoader();

const view2D = ref(); //div

let LeftPlane: THREE.Mesh;
let TopPlane: THREE.Mesh;
let FrontPlane: THREE.Mesh;
let DownPlane: THREE.Mesh;
let RightPlane: THREE.Mesh;
let BehindPlane: THREE.Mesh;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let intersected: any;
let material: THREE.MeshBasicMaterial;
let composer: EffectComposer, outlinePass: OutlinePass;

function init() {
  scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  camera = new THREE.PerspectiveCamera(75, view2D.value.clientWidth / view2D.value.clientHeight, 1, 1000);
  camera.position.z = 150;

  renderer = new THREE.WebGLRenderer();
  renderer.render(scene, camera);
  renderer.setSize(view2D.value.clientWidth, view2D.value.clientHeight);
  controls = new OrbitControls(camera, renderer.domElement);

  composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
  composer.addPass(outlinePass);

  addMesh();
  animate();
}

function animate() {
  renderer.render(scene, camera);
  controls.update();
  composer.render();
  render();
  requestAnimationFrame(animate);
}

//添加物体
function addMesh() {
  const geometry = new THREE.PlaneGeometry(50, 50);

  //右
  RightPlane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ map: textureLoader.load(liveR), side: THREE.DoubleSide, name: "RightPlane" })
  );
  RightPlane.position.x = -50;
  RightPlane.name = "RightPlane";
  //后
  BehindPlane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ map: textureLoader.load(liveB), side: THREE.DoubleSide, name: "BehindPlane" })
  );
  BehindPlane.name = "BehindPlane";
  //左
  LeftPlane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ map: textureLoader.load(liveL), side: THREE.DoubleSide, name: "LeftPlane" })
  );
  LeftPlane.position.x = 50;
  LeftPlane.name = "LeftPlane";
  //前
  FrontPlane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ map: textureLoader.load(liveF), side: THREE.DoubleSide, name: "FrontPlane" })
  );
  FrontPlane.position.x = 100;
  FrontPlane.name = "FrontPlane";
  //上
  TopPlane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ map: textureLoader.load(liveU), side: THREE.DoubleSide, name: "TopPlane" })
  );
  TopPlane.position.x = 100;
  TopPlane.position.y = 50;
  TopPlane.name = "TopPlane";
  //下
  DownPlane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ map: textureLoader.load(liveD), side: THREE.DoubleSide, name: "DownPlane" })
  );
  DownPlane.position.x = 100;
  DownPlane.position.y = -50;
  DownPlane.name = "DownPlane";

  scene.add(LeftPlane);
  scene.add(TopPlane);
  scene.add(FrontPlane);
  scene.add(DownPlane);
  scene.add(RightPlane);
  scene.add(BehindPlane);
}

const isClose = ref(false);
function actionClose() {
  gsap.to(RightPlane.rotation, { y: -Math.PI / 2, duration: 1 });
  gsap.to(RightPlane.position, { x: -25, duration: 1 });

  gsap.to(BehindPlane.position, { z: 25, duration: 1 });

  gsap.to(LeftPlane.rotation, { y: Math.PI / 2, duration: 1 });
  gsap.to(LeftPlane.position, { x: 25, duration: 1 });

  gsap.to(FrontPlane.rotation, { y: Math.PI, duration: 2 });
  gsap.to(FrontPlane.position, { x: 0, z: -25, duration: 2 });

  gsap.to(TopPlane.rotation, { x: Math.PI / 2, y: Math.PI, duration: 2 });
  gsap.to(TopPlane.position, { x: 0, y: 25, duration: 2 });

  gsap.to(DownPlane.rotation, { x: -Math.PI / 2, y: Math.PI, duration: 2 });
  gsap.to(DownPlane.position, { x: 0, y: -25, z: 0, duration: 2 });

  gsap.to(camera.position, { x: 0, y: 0, z: 150, duration: 2 });
  camera.lookAt(0, 0, -1);
  isClose.value = true;
}
function actionOpen() {
  gsap.to(RightPlane.rotation, { y: 0, duration: 1 });
  gsap.to(RightPlane.position, { x: -50, duration: 1 });

  gsap.to(BehindPlane.position, { z: 0, duration: 1 });

  gsap.to(LeftPlane.rotation, { y: 0, duration: 1 });
  gsap.to(LeftPlane.position, { x: 50, duration: 1 });

  gsap.to(FrontPlane.rotation, { y: 0, duration: 2 });
  gsap.to(FrontPlane.position, { x: 100, z: 0, duration: 2 });

  gsap.to(TopPlane.rotation, { x: 0, y: 0, duration: 2 });
  gsap.to(TopPlane.position, { x: 100, y: 50, duration: 2 });

  gsap.to(DownPlane.rotation, { x: 0, y: 0, duration: 2 });
  gsap.to(DownPlane.position, { x: 100, y: -50, z: 0, duration: 2 });

  gsap.to(camera.position, { x: 0, y: 0, z: 150, duration: 2 });
  camera.lookAt(0, 0, -1);
  isClose.value = false;
}

function render() {
  //
}

let selectedObjects: any[] | THREE.Object3D<THREE.Event>[];
function addSelectedObject(object: THREE.Object3D<THREE.Event>) {
  selectedObjects = [];
  selectedObjects.push(object);
}

let cube = ref("");
let isClick = ref(false);
onMounted(() => {
  if (view2D.value && view2D.value.clientWidth && view2D.value.clientHeight) {
    init();
    animate();

    const dom = document.getElementById("edit-container") as HTMLElement;
    dom.appendChild(renderer.domElement);

    window.addEventListener("resize", function () {
      camera.aspect = view2D.value.clientWidth / view2D.value.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(view2D.value.clientWidth, view2D.value.clientHeight);
    });

    let aTest = [LeftPlane, RightPlane, TopPlane, DownPlane, FrontPlane, BehindPlane];
    dom.addEventListener("pointermove", (event) => {
      if (event.isPrimary === false) return;

      pointer.x = (event.clientX / view2D.value.clientWidth) * 2 - 1;
      pointer.y = -(event.clientY / view2D.value.clientHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObjects(aTest, true);

      if (intersects.length > 0) {
        addSelectedObject(intersects[0].object);
        outlinePass.selectedObjects = selectedObjects;
      } else {
        if (isClick.value === false) {
          outlinePass.selectedObjects = [];
        }
      }
    });

    dom.addEventListener("click", (event) => {
      pointer.x = (event.clientX / view2D.value.clientWidth) * 2 - 1;
      pointer.y = -(event.clientY / view2D.value.clientHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObjects(aTest, true);

      if (intersects.length > 0) {
        isClick.value = true;
        cube.value = intersects[0].object.name;
      } else {
        isClick.value = false;
        cube.value = "";
      }
    });
  }
});
</script>

<style lang="scss">
.edit-container {
  width: 100%;
  height: 100%;
  .btn {
    position: absolute;
    z-index: 1;
    top: 20px;
    left: 20px;
  }
  .cube-container {
    width: 100px;
    height: 100px;
    position: absolute;
    z-index: 1;
    top: 20px;
    right: 20px;
    background-color: aliceblue;
    color: black;
  }
}
</style>
