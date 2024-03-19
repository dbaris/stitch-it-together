import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import * as topojson from "https://cdn.skypack.dev/topojson@3.0.2"; 

class Projection {
    constructor(color, name, projection, line_dash) {
      this.color = color;
      this.name = name;
      this.projection = projection();
      this.line_dash = line_dash;
  
    }
};

var projections = []
projections.push(new Projection('#000000', "Mercator", d3.geoMercator, [0,0]));
projections.push(new Projection('#000000', "Equirectangular", d3.geoNaturalEarth1, [1,5]));

// const outline = ({type: "Sphere"});
// const graticule = d3.geoMercator();


function drawMap() {
    fetch('./data/north_america.json')
        .then((response) => response.json()
        )
        .then((json) => {
            const world = topojson.topology({land: json});
            const land = topojson.feature(world, world.objects.land);

            var width = 1200;
            var height = 0;
            function setMaxHeight(projection){
                height = Math.max(height, fitWidth(projection.projection, width, land));
            }
            projections.forEach(setMaxHeight);

            function resize(){
                // proprotion to screen
                while (height > window.screen.height * .75){
                    width = width * .9;
                    height = height * .9;
                }
            };
            resize();
            
            const canvas = document.getElementById('migration-canvas');
            const context = canvas.getContext("2d");
            context.canvas.width  = width;
            context.canvas.height = height;
            context.fillStyle = "#fff";
            context.strokeStyle = "#ffffff";
            context.fillRect(0, 0, width, height);
            context.save();

            function render(projection) {
                const path = d3.geoPath(projection.projection, context);
                context.strokeStyle = projection.color;  
                context.setLineDash(projection.line_dash);
                context.save();
                context.beginPath(), path(land), context.clip();
                context.beginPath(), path(land), context.globalAlpha = 1.0, context.stroke();
                context.save();
                context.restore();

            }

            projections.forEach(render);
            context.restore();

        });
}

function fitWidth(projection, width, outline) {
    const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
    const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    return dy;
}

drawMap();
