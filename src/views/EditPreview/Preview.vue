<template>
  <div id="preview-container" ref="view3D" class="preview-container">
    <el-button class="tip-btn" type="success" @click="addJumpTip">添加跳转</el-button>
    <div id="test-container" class="test-container">提示</div>
  </div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

import tip from "@/assets/imgs/tip.png";
import { Material } from "three";

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls;

const view3D = ref(); //div

function init() {
  scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  camera = new THREE.PerspectiveCamera(75, view3D.value.clientWidth / view3D.value.clientHeight, 1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.render(scene, camera);
  renderer.setSize(view3D.value.clientWidth, view3D.value.clientHeight);
  controls = new OrbitControls(camera, renderer.domElement);
  addMesh();
}
function animate() {
  renderer.render(scene, camera);
  controls.update();
  //  render();
  requestAnimationFrame(animate);
}
let boxMaterials: Material[] = [];
let cube: THREE.Mesh;
let imgList = [liveR, liveL, liveU, liveD, liveF, liveB]; //右，左，上，下，前，后
function addMesh() {
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  imgList.forEach((item) => {
    let texture = new THREE.TextureLoader().load(item);
    boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
  });

  cube = new THREE.Mesh(geometry, boxMaterials);
  //翻转
  cube.geometry.scale(1, 1, -1);

  scene.add(cube);
}
function addJumpTip() {
  const dom = document.getElementById("test-container");
  const map = new THREE.TextureLoader().load(dom);
  const material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });

  const sprite = new THREE.Sprite(material) as any;
  sprite.globalName = "tip";
  sprite.name = "";
  console.log(sprite);

  scene.add(sprite);
}
onMounted(() => {
  if (view3D.value && view3D.value.clientWidth && view3D.value.clientHeight) {
    init();
    animate();

    const dom = document.getElementById("preview-container") as HTMLElement;
    dom.appendChild(renderer.domElement);

    window.addEventListener("resize", function () {
      camera.aspect = view3D.value.clientWidth / view3D.value.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(view3D.value.clientWidth, view3D.value.clientHeight);
    });
  }
});
</script>
<style lang="scss">
.preview-container {
  width: 100%;
  height: 100%;
  .tip-btn {
    position: absolute;
    z-index: 1;
    top: 20px;
    left: 20px;
  }
  .test-container {
    display: none;
    width: 100px;
    height: 100px;
    background-color: rgba(0, 0, 0, 0.4);
    color: white;
  }
}
</style>
