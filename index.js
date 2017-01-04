/**
 * @author Takahiro / https://github.com/takahirox
 */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before' +
                  'AFRAME was available.');
}

require('three/examples/js/shaders/CopyShader');
require('three/examples/js/shaders/FXAAShader');
require('three/examples/js/postprocessing/EffectComposer');
require('three/examples/js/postprocessing/RenderPass');
require('three/examples/js/postprocessing/ShaderPass');
require('three/examples/js/renderers/WebGLDeferredRenderer');

AFRAME.registerComponent('deferred-renderer', {
  schema: {
    lightPrePass: {type: 'boolean', default: true}
  },

  init: function () {
    this.renderer = null;
  },

  update: function () {
    this.setupDeferredRenderer();
  },

  play: function () {
    // just in case
    this.setupDeferredRenderer();
  },

  setupDeferredRenderer: function () {
    if (this.renderer !== null) { return; }

    var data = this.data;
    var el = this.el;
    var sceneEl = el.sceneEl;
    var renderer = sceneEl.renderer;

    if (renderer === undefined) { return; }

    var size = renderer.getSize();
    var newRenderer = new THREE.WebGLDeferredRenderer({renderer:renderer});
    newRenderer.enableLightPrePass(data.lightPrePass);
    newRenderer.setSize(size.width, size.height);

    var keys = Object.keys(renderer);
    for (var i = 0, il = keys.length; i < il; i++) {
      var key = keys[i];
      if (newRenderer[key] === undefined) {
        newRenderer[key] = typeof renderer[key] === 'function'
                          ? renderer[key].bind(renderer)
                          : renderer[key];
      }
    }

    // override scene renderer and effect
    // this's very sensitive to sceneEl impl
    this.renderer = newRenderer;
    sceneEl.renderer = newRenderer;
    sceneEl.effect = new THREE.VREffect(this.renderer);
  }
});
