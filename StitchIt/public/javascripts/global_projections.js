// import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import * as topojson from "https://cdn.skypack.dev/topojson@3.0.2"; 
import {Projection} from "./projection.js";

var p1 = new Projection('#ff0000', "Orthographic", 'global-projection1', d3.geoOrthographic, drawMap);
var p2 = new Projection('#d00df2', "Mercator", 'global-projection2', d3.geoMercator, drawMap);

const outline = ({type: "Sphere"});
const graticule = d3.geoGraticule10();

var width = 900;
var height1 = fitWidth(p1.projection);
var height2 = fitWidth(p2.projection);
var height = Math.max(height1, height2);

function resize(){
  height1 = fitWidth(p1.projection);
  height2 = fitWidth(p2.projection);
  height = Math.max(height1, height2);

  // proprotion to screen
  while (height > window.screen.height * .75){
    width = width * .9;
    height1 = fitWidth(p1.projection);
    height2 = fitWidth(p2.projection);
    height = Math.max(height1, height2);
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
      
      const canvas = document.getElementById('global-projections-canvas');
      const context = canvas.getContext("2d");
      context.canvas.width  = width;
      context.canvas.height = height;
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);

      context.save();

      function render(projection, color) {
          const path = d3.geoPath(projection, context);
          context.fillStyle = context.strokeStyle = color;
          context.save();
          context.beginPath(), path(outline), context.clip();
          context.beginPath(), path(graticule), context.globalAlpha = 0.3, context.stroke();
          context.beginPath(), path(land), context.globalAlpha = 1.0, context.fill();
          context.restore();
          context.beginPath(), path(outline), context.stroke();
      }

    context.translate(0, (height - height1) / 2);
    render(p1.projection, p1.color);
    context.restore();

    context.save();
    context.globalCompositeOperation = "multiply";
    context.translate(0, (height - height2) / 2);
    render(p2.projection, p2.color);
    context.restore();
    });
}


function fitWidth(projection) {
    const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
    const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    return dy;
}

drawMap();
