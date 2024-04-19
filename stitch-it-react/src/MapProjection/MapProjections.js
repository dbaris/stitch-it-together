import React, { useEffect, useState } from 'react';
import "./MapProjections.css"
// import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import * as topojson from "https://cdn.skypack.dev/topojson@3.0.2"; 


function MapProjection(props) {

    const {projections, data_type, id, dataset_paths, width_multiplier, top} = props;
    const NORTH_AMERICA = "north_america";
    const WORLD = "world"
    var outline = ({type: "Sphere"});
    const graticule = d3.geoGraticule10();

    var width = window.screen.width * .4 * width_multiplier;
    console.log(projections)
    // console.log(projections.map(p => {return fitWidth(p.projection, outline)}))
    var height = Math.max(...projections.map(p => {return fitWidth(p.projection, outline)}));

    drawMap();


    return (
        <div id={'global-projections-canvas-container'+id} className='global-projections-canvas-container'>
            <canvas style={{top: top}} id={'global-projections-canvas'+ id} className='global-projections-canvas'></canvas>
        </div> 
    );

    //What is this resize function for?
    // function resize(){
    //     height = Math.max(...projections.map(p => {return fitWidth(p.projection, outline)}));
    //     // proprotion to screen
    //     while (height > window.screen.height * .75){
    //         width = width * .9;
    //         height =  Math.max(...projections.map(p => {return fitWidth(p.projection, outline)}));
    //         // height = height * .9
    //     }
    // }

    //context.save() -- works like a p5 push call
    //context.restore() -- works like a p5 pop call. 

    function drawMap() {
        // resize();
        fetch(data_type === NORTH_AMERICA ? './data/north_america.json' : './data/world.json')
            .then((response) => response.json()
            )
            .then((json) => {
            var world;
            if(data_type === NORTH_AMERICA)
                world = (data_type === NORTH_AMERICA) ? topojson.topology({land: json}) : json;
            else
                world = json;
            const land = topojson.feature(world, world.objects.land);
            // outline = land
            const canvas = document.getElementById('global-projections-canvas'+id);
            const context = canvas.getContext("2d");
            context.canvas.width  = width / width_multiplier;
            context.canvas.height = height;
            //canvas background color
            context.fillStyle = "#fff";

            function render(projection, color) {
                context.globalCompositeOperation = "multiply";
                const path = d3.geoPath(projection, context);
                context.fillStyle = context.strokeStyle = color;
                context.save();
                //  *** grid lines ***  //
                context.beginPath(); path(graticule); context.globalAlpha = 0.3; context.stroke();
                // *** rendering different projections *** //
                context.beginPath(); path(land); context.globalAlpha = 1.0; context.fill();
                context.restore();
                // ** Rendering globe outline **  //
                context.beginPath(); path(outline); context.stroke();
                context.restore();
            }

            function render_outline(projection) {
                context.globalCompositeOperation = "add";
                const path = d3.geoPath(projection.projection, context);
                context.strokeStyle = projection.color;  
                context.setLineDash([projection.line_dash]);
                context.save();
                // *** -- clipping path, not sure we need this, cutting off half of stroke
                // context.beginPath(); path(land); context.clip();
                // *** --- render outlines 
                context.beginPath(); path(land); context.globalAlpha = 1.0; context.stroke();
                context.restore();

            }
            context.save();
            var i = 0;
            for(var p of projections) {
                context.translate(0, (height - fitWidth(p.projection, outline)) / 2);
                if(data_type == WORLD) {
                    render(p.projection, p.color) 
                }
                else {
                    render_outline(p) 
                }
                if(i === 0) {
                    for(var d of dataset_paths){
                        renderFeatureCollection(d, p.projection, context, "blue")
                    }
                }
                i++;
            }
        });
    }

    function renderFeatureCollection(d, projection, context, color) {
        fetch(d.path)
        .then((response) => response.json()
        )
        .then((json) => {
            // console.log(json)
            var geometries = json.features;
            context.save();
            // console.log(geometries[i])
            const path = d3.geoPath(projection, context);
            context.strokeStyle = d.color;
            context.beginPath(); path(json); context.globalAlpha = 0.3; context.stroke(); context.fill();
                // *** rendering different projections *** //
            context.restore();
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

    // function fitWidth(projection, width, outline) {
    //     const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
    //     const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
    //     projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    //     return dy;
    // }

}

export default MapProjection;

