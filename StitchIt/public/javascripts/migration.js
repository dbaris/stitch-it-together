import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as topojson from "https://cdn.skypack.dev/topojson@3.0.2"; 
import {Projection} from "./projection.js";

const projectionType = d3.geoMercator;
var p1 = new Projection('#000000', "Mercator", 'projection1', projectionType);

const outline = ({type: "Sphere"});
// const graticule = d3.geoMercator();

var width = 900;
var height = fitWidth(p1.projection);

function resize(){
  height = fitWidth(p1.projection);

  // proprotion to screen
  while (height > window.screen.height * .75){
    width = width * .9;
    height = fitWidth(p1.projection);
  }
}

function drawMap() {
  resize();
  fetch('./data/world.json')
    .then((response) => response.json()
    )
    .then((json) => {
      const world = json;
      const land = topojson.feature(world, world.objects.land);
      
      const canvas = document.getElementById('migration-canvas');
      const context = canvas.getContext("2d");
      context.canvas.width  = width;
      context.canvas.height = height;
      context.fillStyle = "#fff";
      context.strokeStyle = "#ffffff";
      context.fillRect(0, 0, width, height);

      context.save();

      function render(projection, color) {
          const path = d3.geoPath(projection, context);
          context.strokeStyle = color;
          context.save();
          context.beginPath(), path(outline), context.clip();
        //   context.beginPath(), path(graticule), context.globalAlpha = 0.3, context.stroke();
          context.beginPath(), path(land), context.globalAlpha = 1.0, context.stroke();
          context.restore();
        //   context.beginPath(), path(outline), context.stroke();
      }

    // context.translate(0, (height - height1) / 2);
    render(p1.projection, p1.color);
    context.restore();

    context.save();
    });
}


function fitWidth(projection) {
    const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
    const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    return dy;
}

drawMap();
