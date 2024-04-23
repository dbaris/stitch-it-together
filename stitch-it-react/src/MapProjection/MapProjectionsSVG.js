import React, { useEffect, useState } from 'react';
import "./MapProjections.css"
// import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import * as topojson from "https://cdn.skypack.dev/topojson@3.0.2"; 


function MapProjectionSVG(props) {

    const {projections, config, id, dataset_paths} = props;
    const graticule = d3.geoGraticule10();
    const outline = ({type: "Sphere"});
    var width = window.screen.width * .55;
    var map_data;

    var height = (!config.outline) ?  Math.max(...projections.map(p => {return fitWidth(p.projection, outline)})) : window.screen.height;
    // var height = window.screen.height;

    drawMap();


    return (
        <div id={'global-projections-canvas-container'+id} className='global-projections-canvas-container'>
          <svg width={width} height={height}>
          <g class="graticule"><path></path></g>
          {/* <g class="circles"></g> */}
          <g class="map1"></g>
          <g class="map2"></g>
          <g class="map0"></g>
          {/* <circle class="projection-center" r="40"></circle> */}
        </svg>        
        </div> 
        
    );

    function update(geoGenerator, geojson, p, map) {

        let u = d3.select(map)
        .selectAll('path')
        .data(geojson.features)
        u.enter()
        .append('path')
        .merge(u)
        .attr('d', geoGenerator)
        .style("fill", p.color)
        .style("fill-opacity", p.fill_opacity)
        .style("stroke", d => (config.outline) ? "black" : p.color) 
        .style("stroke-dasharray", p.line_dash)
        .attr("stroke-opacity", p.stroke_opacity);

          // Update graticule

        d3.select('.graticule path')
        .datum(graticule)
        .attr('d', geoGenerator)
        .style("fill", p.color)

    }


    function drawMap() {
        if(map_data) {
            // drawProjections(map_data)
        }
        else {
            fetch(config.data)
                .then((response) => response.json()
                )
                .then((json) => {
                    drawProjections(json)
            });
        }
    }

    function drawProjections(json) {
        var world = (config.topojson) ? topojson.topology({land: json}) : json;
        const land = topojson.feature(world, world.objects.land);
        var i = 0;
        // This is not the right way to update circles and paths -- 
        d3.select("g.map0").selectAll('path').remove()
        d3.select("g.map1").selectAll('path').remove()
        d3.select("g.map2").selectAll('path').remove()
        // ---
        for(var p of projections) {
            // .scale(550).translate([1570, 1100])
            if(config.outline) {p.projection.center([-120, 75]).scale(600)}
            var map = "g.map"+i
            var geoGenerator = d3.geoPath(p.projection)
            update(geoGenerator, land, p, map)
            if(i === 0) {
                for(var d of dataset_paths){
                    renderFeatureCollection(d, p.projection, d.color)
                }
            }
            i++;
            // geoGenerator(graticule)
        }

    }


    function renderFeatureCollection(d, projection, color) {
        if(d.data) {
            renderFeatures(d, projection, color)
        }
        else {
            fetch(d.path)
            .then((response) => response.json()
            )
            .then((json) => {
                d.data = json;
                renderFeatures(d, projection, color)
            })
        }
    }

    function renderFeatures(features, projection, color) {
        const path = d3.geoPath(projection);
        if(features.icon_function) {
            d3.select("g.map0")
                .selectAll("path")
                .data(features.data.features)
                .enter()
                .append("path")
                // .attr("d", "M 0 20 L 100 205 M 100 400 L 0 0")
                .attr("d", d => {
                    let xy = projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]);
                    let line = features.icon_function(d.geometry.coordinates[0], d.geometry.coordinates[1], 5, projection)
                    return line;
                }) 
                .attr("r", 5)
                .attr('cx', d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0])
                .attr('cy', d =>  projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1])
                .style("fill", "none")
                .style("stroke", color)
                .style("stroke-width", 2)
        } 
        else {
            d3.select("g.map0")
                .datum({type: "FeatureCollection", features: features.data.features})
                .append('path')
                .attr("d", d3.geoPath(projection))
                .style("fill", "none")
                .style("stroke", d => { return color})
                .style("opacity", features.opacity)
        }
        
    }
    
 
    function fitWidth(projection, outline) {
        const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
        const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
        projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
        return dy;
    }

}

export default MapProjectionSVG;


