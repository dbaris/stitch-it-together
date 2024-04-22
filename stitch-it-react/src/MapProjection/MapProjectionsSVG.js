import React, { useEffect, useState } from 'react';
import "./MapProjections.css"
// import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import * as topojson from "https://cdn.skypack.dev/topojson@3.0.2"; 


function MapProjectionSVG(props) {

    const {projections, data_type, id, dataset_paths, width_multiplier, top} = props;
    const NORTH_AMERICA = "north_america";
    const WORLD = "world"
    var outline = ({type: "Sphere"});
    const graticule = d3.geoGraticule10();

    var width = window.screen.width * .49 * width_multiplier;
    console.log(projections)
    // console.log(projections.map(p => {return fitWidth(p.projection, outline)}))
    var height = Math.max(...projections.map(p => {return fitWidth(p.projection, outline)}));

    drawMap();


    return (
        <div id={'global-projections-canvas-container'+id} className='global-projections-canvas-container'>
          <svg width={width} height={height}>
          <g class="graticule"><path></path></g>
          {/* <g class="circles"></g> */}
          <g class="map0"></g>
          <g class="map1"></g>
          {/* <circle class="projection-center" r="40"></circle> */}
        </svg>        
        </div> 
        
    );

//     let geoGenerator = d3.geoPath()
//   .projection(projection);

    function update(geoGenerator, geojson, p, map) {

        let u = d3.select(map)
        .selectAll('path')
        .data(geojson.features)

        u.enter()
        .append('path')
        .merge(u)
        .attr('d', geoGenerator)
        .style("fill", p.color)
        .style("opacity", ".5")
        .style("stroke", p.color) 

    }


    function drawMap() {

	// });
        // resize();
        fetch(data_type === NORTH_AMERICA ? './data/north_america.json' : './data/world.json')
            .then((response) => response.json()
            )
            .then((json) => {
            var world;
            world = (data_type === NORTH_AMERICA) ? topojson.topology({land: json}) : json;
            const land = topojson.feature(world, world.objects.land);
            var i = 0;
            d3.selectAll('path').remove()
            for(var p of projections) {
                var geoGenerator = d3.geoPath(p.projection.scale(600).translate([1450, 850]))
                // var projection = d3['geo'+p.name]();
                // projection.scale(220).translate([650, 600])
                // let geoGenerator = d3.geoPath()
                // .projection(projection);
                var map = "g.map"+i
                update(geoGenerator, land, p, map)
                // d3.select('g.map1').selectAll('path').exit().remove()
                if(i === 0) {
                    for(var d of dataset_paths){
                        renderFeatureCollection(d, p.projection, d.color)
                    }
                }
                i++;
            }
        });
    }

    function renderFeatureCollection(d, projection, color) {
        fetch(d.path)
        .then((response) => response.json()
        )
        .then((json) => {
            // console.log(json)
            var geometries = json.features;
            // console.log(geometries[i])
            const path = d3.geoPath(projection);
            // path.pointRadius(.5)

            d3.select("g.map0").append("path")
                .datum({type: "FeatureCollection", features: json.features})
                .attr("d", d3.geoPath(projection))
                .style("fill", "none")
                .style("stroke", color)
            // context.strokeStyle = d.color;
            // context.beginPath(); path(json); context.globalAlpha = d.opacity; context.stroke();
            //     // *** rendering different projections *** //
            // context.restore();
            // d3.select("svg").selectAll("circle.cities").data(customerListData.features)
            // .enter()
            // .append("circle")
            // .attr("r", 5)
            // .attr("cx", function(d) {return projection([d.geometry.coordinates])[0]})
            // .attr("cy", function(d) {return projection([d.geometry.coordinates])[1]})
            // .on("click", function(d) {console.log(d)})
        })
    }
    
 
    function fitWidth(projection, outline) {
        const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
        const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
        projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
        return dy;
    }

}

export default MapProjectionSVG;

