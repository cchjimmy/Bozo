import Vec2 from "./utilities/Vec2.js";
import debounce from "./utilities/debounce.js";
import Renderer2D from "./Renderer2D.js";
import SceneManager from "./SceneManager.js";
import AssetManager from "./AssetManager.js";
import randomRange from "./utilities/randomRange.js";
import CameraManager from "./CameraManager.js";
import GuiManager from "./gui/GuiManager.js";
import AudioManager from "./AudioManager.js";

export default class Engine {
  constructor(options = {
    resolution: { width: 256, height: 240 },
    pixelDensity: 1,
    unitScale: 10,
    frameRate: 30,
    showFps: true,
    showQuadtree: false
  }) {
    this.options = {};
    if (options) {
      for (let option in options) {
        this.options[option] = options[option];
      }
    }

    this.sceneManager = new SceneManager;
    this.renderer = new Renderer2D;
    this.assetManager = new AssetManager;
    this.cameraManager = new CameraManager;
    this.guiManager = new GuiManager;
    this.audioManager = new AudioManager;
  }

  init() {
    if (!this.renderer.context) {
      console.error("Unable to initialize CanvasRenderingContext2D");
      return;
    }

    this.renderer.setResolution(this.options.resolution.width, this.options.resolution.height);
    this.renderer.setUnitScale(this.options.unitScale);
    this.renderer.setPixelDensity(this.options.pixelDensity);

    this.guiManager.create("Bozo");
    this.guiManager.draw("Bozo");
    this.guiManager.display("Bozo", `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    
    Why do we use it?
    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
    
    
    Where does it come from?
    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
    
    The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
    
    Where can I get some?
    There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`)

    // for (let i = 0; i < 1000; i++) {
    //   this.sceneManager.createEntity({
    //     position: new Vec2(randomRange(-5, 5), randomRange(-5, 5)),
    //     size: new Vec2(randomRange(1, 2), randomRange(1, 2)),
    //     velocity: new Vec2(randomRange(-1, 1), randomRange(-1, 1)),
    //     color: `rgba(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(0, 255)}, 1)`,
    //     collider: true
    //   });
    // }

    this.sceneManager.createEntity({ position: new Vec2(0, 0), collider: true });
    // this.sceneManager.createEntity({ position: new Vec2(1, 1), camera: new Vec2(0, 0), collider: true });

    function resizeToFit(renderer, options) {
      if (window.innerWidth > window.innerHeight) {
        renderer.setSize(options.resolution.width * innerHeight / options.resolution.height, innerHeight);
      } else {
        renderer.setSize(innerWidth, options.resolution.height * innerWidth / options.resolution.width);
      }
    }
    resizeToFit(this.renderer, this.options);

    window.onresize = () => {
      this.isLooping = false;
      debounce(() => {
        resizeToFit(this.renderer, this.options);
        this.isLooping = true;
      }, 200);
    }

    this.isLooping = true;
    this.loop();

    this.sceneManager.update(1 / this.options.frameRate, this.renderer.unitScale, this.renderer.canvas.width, this.renderer.canvas.height);
  }

  loop() {
    if (this.isLooping) {
      this.renderer.clear();
      // draw only when not resizing
      this.renderer.draw(this.sceneManager.getTransforms(), this.sceneManager.getColors());
    }

    requestAnimationFrame(() => { this.loop(); });

    if (this.options.showQuadtree) {
      this.renderer.qtree.show(this.renderer.context);
    }
  }
}
