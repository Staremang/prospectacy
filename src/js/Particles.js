// import Proton from 'proton-js';
import Proton from 'proton-js/src/index';


function customScaleBehaviour() {
  return {
    initialize(particle) {
      particle.oldRadius = particle.radius;
      particle.scale = 0;
    },
    applyBehaviour(particle) {
      if (particle.energy >= 2 / 3) {
        particle.scale = (1 - particle.energy) * 3;
      } else if (particle.energy <= 1 / 3) {
        particle.scale = particle.energy * 3;
      }
      particle.radius = particle.oldRadius * particle.scale;
    },
  };
}


export default class Particles {
  constructor(canvas, src) {
    if (!canvas) {
      return;
    }

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.proton = null;
    this.renderer = null;
    this.emitter = null;
    // stats = null;
    // this.index = null;
    this.randomBehaviour = null;
    this.gravity = null;
    this.mouseObj = null;
    this.repulsionBehaviour = null;
    this.attractionBehaviour = null;


    this.imageSrc = src;
    this.offsetTop = null;
    this.offsetLeft = null;

    this.init();
  }

  init() {
    this.calculate();

    this.loadImage();

    this.mouseObj = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    };

    window.addEventListener('resize', this.calculate);
  }

  calculate = () => {
    const rect = this.canvas.getBoundingClientRect();
    this.offsetTop = rect.top + window.pageYOffset;
    this.offsetLeft = rect.left + window.pageXOffset;
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    this.context.globalCompositeOperation = 'lighter';
  };

  loadImage() {
    const image = new Image();
    image.addEventListener('load', this.imageOnLoad);
    image.src = this.imageSrc;
  }

  imageOnLoad = (e) => {
    const rect = new Proton.Rectangle(
      (this.canvas.width - e.target.width) / 2,
      (this.canvas.height - e.target.height) / 2,
      e.target.width, e.target.height,
    );
    this.context.drawImage(e.target, rect.x, rect.y);
    this.createProton(rect);

    this.tick();
  };

  createProton(rect) {
    this.proton = new Proton();
    this.emitter = new Proton.Emitter();

    // setRate
    this.emitter.rate = new Proton.Rate(new Proton.Span(40, 40), new Proton.Span(0.08));

    // addInitialize
    this.emitter.addInitialize(new Proton.Position(new Proton.PointZone(3, 5)));
    this.emitter.addInitialize(new Proton.Mass(3));
    this.emitter.addInitialize(new Proton.Radius(1, 2));
    this.emitter.addInitialize(new Proton.Life(4));
    const imagedata = this.context.getImageData(rect.x, rect.y, rect.width, rect.height);
    this.emitter.addInitialize(new Proton.P(new Proton.ImageZone(imagedata, rect.x, rect.y + 10)));

    // addBehaviour

    this.randomBehaviour = new Proton.RandomDrift(20, 18, 0.2);
    this.gravity = new Proton.Gravity(0);
    this.emitter.addBehaviour(customScaleBehaviour());
    this.attractionBehaviour = new Proton.Attraction(this.mouseObj, 12, 100);
    this.attractionBehaviour2 = new Proton.Attraction(this.mouseObj, 0, 0);
    this.repulsionBehaviour = new Proton.Repulsion(this.mouseObj, 3, 0);
    this.emitter.addBehaviour(this.attractionBehaviour);
    // this.emitter.addBehaviour(this.repulsionBehaviour);
    // this.emitter.addBehaviour(this.attractionBehaviour2);
    this.emitter.addBehaviour(this.gravity);
    this.emitter.addBehaviour(this.randomBehaviour);
    this.emitter.addBehaviour(new Proton.Color(['#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#d3bc7b', '#005eec', '#005eec', '#d3bc7b']));
    this.emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(2, 0, this.canvas.width, this.canvas.height), 'collision'));
    this.emitter.emit();
    // add this.emitter
    this.proton.addEmitter(this.emitter);

    // this.canvas this.renderer
    this.renderer = new Proton.CanvasRenderer(this.canvas);
    this.proton.addRenderer(this.renderer);
    // this.canvas.addEventListener('mousemove', this.mousemoveHandler);
    document.getElementById('hero-section').addEventListener('mousemove', this.mousemoveHandler);

    // debug
    // Proton.Debug.drawEmitter(this.proton, this.canvas, this.emitter);
  }


  mousemoveHandler = (e) => {
    // if (e.layerX || e.layerX === 0) {
    //   this.mouseObj.x = e.layerX;
    //   this.mouseObj.y = e.layerY;
    // } else if (e.offsetX || e.offsetX === 0) {
    //   this.mouseObj.x = e.offsetX;
    //   this.mouseObj.y = e.offsetY;
    // }

    // this.repulsionBehaviour.reset(this.mouseObj, -12, 50);

    this.mouseObj = {
      x: Math.round(100 * (window.App.cursor.x - this.offsetLeft)) / 100,
      y: Math.round(100 * (window.App.cursor.y - (this.offsetTop - window.pageYOffset))) / 100,
    };

    this.attractionBehaviour.reset(this.mouseObj, -10, 60);
    // this.attractionBehaviour.reset(this.mouseObj, 5, 100);
    // this.attractionBehaviour2.reset(this.mouseObj, 12, 100);
  };

  tick = () => {
    requestAnimationFrame(this.tick);
    this.proton.update();
  };
}
