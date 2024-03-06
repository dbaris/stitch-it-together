import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import * as d3_geo from "https://cdn.jsdelivr.net/npm/d3-geo@3";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import * as topojson from "https://cdn.skypack.dev/topojson@3.0.2"; 

const outline = ({type: "Sphere"});
const graticule = d3.geoGraticule10();
var width = 900;
// const projectionSelect = d3_geo_projection.geoPolyhedralWaterman();
const projectionSelect = d3.geoMercator();

var height = fitWidth(projectionSelect);

// proprotion to screen
while (height > window.screen.height * .75){
    width = width * .9;
    height = fitWidth(projectionSelect);
}

fetch('./data/north_america.json')
    .then((response) => response.json()
    )
    .then((json) => {
      const world = topojson.topology({land: json});
      console.log(world);
      const land = topojson.feature(world, world.objects.land);
      const canvas = document.getElementById('us_mexico');
      
      const context = canvas.getContext("2d");
      context.canvas.width  = width;
      context.canvas.height = height;
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);
      context.save();

      function render(color) {
          const path = d3.geoPath(projectionSelect, context);
        //   context.fillStyle = context.strokeStyle = color;
          context.strokeStyle = "black";
          context.lineWidth = .25;
          context.save();
          context.beginPath(), path(outline), context.clip();
          context.beginPath(), path(graticule), context.globalAlpha = 0.3, context.stroke();
          context.beginPath(), path(land), context.globalAlpha = 1.0, context.stroke();
          context.restore();
          context.beginPath(), path(outline), context.stroke();
      }


    render("red");
    context.restore();

    context.save();
    // context.globalCompositeOperation = "multiply";
    context.restore();
    });

function fitWidth(projection) {
    const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
    const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    console.log(dy);
    return dy;
}
