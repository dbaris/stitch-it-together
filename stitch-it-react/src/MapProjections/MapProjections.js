import React, { useEffect, useState } from 'react';
import "./MapProjections.css"
// import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import * as topojson from "https://cdn.skypack.dev/topojson@3.0.2"; 
import {Projection} from "./projection.js";



function MapProjection(props) {

    const {projections} = props;
    const NORTH_AMERICA = "north_america";
    const WORLD = "world"
    const data_type = NORTH_AMERICA;
    
    var outline = ({type: "Sphere"});
    const graticule = d3.geoGraticule10();

    var width = window.screen.width * .4;
    console.log(projections.map(p => {return fitWidth(p.projection, outline)}))
    var height = Math.max(...projections.map(p => {return fitWidth(p.projection, outline)}));
    console.log(height)

    drawMap();


    return (
        <div id='global-projections-canvas-container'>
            <canvas id='global-projections-canvas'></canvas>
        </div> 
    );

    function resize(){
        height = Math.max(...projections.map(p => {return fitWidth(p.projection, outline)}));

        // proprotion to screen
        while (height > window.screen.height * .75){
            width = width * .9;
            height =  Math.max(...projections.map(p => {return fitWidth(p.projection, outline)}));
            // height = height * .9
        }
    }

    function drawMap() {
        resize();
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
            const canvas = document.getElementById('global-projections-canvas');
            const context = canvas.getContext("2d");
            context.canvas.width  = width;
            context.canvas.height = height;
            context.fillStyle = "#fff";
            context.fillRect(0, 0, width, height);

            function render(projection, color) {
                const path = d3.geoPath(projection, context);
                context.fillStyle = context.strokeStyle = color;
                context.save();
                context.beginPath()
                path(outline)
                context.clip();
                context.beginPath()
                path(graticule)
                context.globalAlpha = 0.3
                context.stroke();
                context.beginPath()
                path(land)
                context.globalAlpha = 1.0
                context.fill();
                context.restore();
                context.beginPath()
                path(outline)
                context.stroke();
                context.restore();
                context.save();
            }

            function render_outline(projection) {
                const path = d3.geoPath(projection.projection, context);
                context.strokeStyle = projection.color;  
                context.setLineDash(projection.line_dash);
                context.save();
                context.beginPath()
                path(land)
                context.clip();
                context.beginPath()
                path(land)
                context.globalAlpha = 1.0
                context.stroke();
                context.save();
                context.restore();

            }
            context.save();
            for(var p of projections) {
                console.log(fitWidth(p.projection, outline))
                context.translate(0, (height - fitWidth(p.projection, outline)) / 2);
                (data_type === WORLD) ? render(p.projection, p.color) : render_outline(p);
                // context.globalCompositeOperation = "add";
            }
        });
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

