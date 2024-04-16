import React, { useEffect, useState } from 'react';
import "./MapProjections.css"
// import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import * as topojson from "https://cdn.skypack.dev/topojson@3.0.2"; 
import {Projection} from "./projection.js";
    

var link_ids = [
    {'link_id': 'global-projections-link', 'section_id': 'map-projections'},
    {'link_id': 'migration-link', 'section_id': 'migration'},
    {'link_id': 'infrastructure-link', 'section_id': 'infrastructure'}
];


function MapProjections(props) {

    var p1 = new Projection('#ff0000', "Orthographic", 'global-projection1', d3.geoOrthographic, drawMap);
    var p2 = new Projection('#d00df2', "Mercator", 'global-projection2', d3.geoMercator, drawMap);
    
    // const outline = ({type: "Sphere"});
    // const graticule = d3.geoGraticule10();
    
    // var width = window.screen.width * .4;
    // var height1 = fitWidth(p1.projection);
    // var height2 = fitWidth(p2.projection);
    // var height = Math.max(height1, height2);

    // drawMap();

    
    useEffect( () => {
            var init_page = link_ids[0];
            link_ids.forEach(createToggle);
            open_on_page(init_page)
        }, [link_ids]
    )


    return (
        <div class='outer'>
        <div id='title'>
            <div id='title-text'>
                <h1> CounterMapping</h1>
                <div></div>
                <div><h2 class='page-link' id='global-projections-link'>1</h2></div>
                <div><h2 class='page-link' id='migration-link'>2</h2></div>
                <div><h2 class='page-link' id='infrastructure-link'>3</h2></div>
            </div>
        </div>
        <div id='source-code'>
            <a href='https://github.com/dbaris/stitch-it-together'>Source Code</a>
        </div>
        <div class='container' id='map-projections'>
            <div id='map-projection-text'>
                <h2>Map Projections</h2>
                <p>
                    Maps appear to be scientific documents: objective, singular points of truth that generate a sense of authority. However, every map is embedded with a set of constructed decisions that shape a particular narrative. These are not neutral decisions and neither are the images that they produce. Maps are as narrative tools that generate a particular reality, a particular truth.
                </p>
                <p>
                    Earth is a spherical object. To represent this orb in flattened form, projection algorithms convert three-dimensional points to a two-dimensional representation, with different algorithms producing different representations. While some projections maintain geographic scale, others produce size distortions that dramatically under-scale some nations while enlarging others.
                </p>
                <div id='global-projection1' class='projection-input'></div>
                <div id='global-projection2' class='projection-input'></div>
                <div class='sources'>
                    <p>Sources:</p>
                    <a href="https://observablehq.com/@d3/projection-comparison">Observable Projection Comparison Tutorial</a>
                    <p>Snyder, John. Map Projections: A Working Manual. US GPO, 1987.</p>
                </div>
            </div>
            <div id='global-projections-canvas-container'>
                <canvas id='global-projections-canvas'></canvas>
            </div>
        </div>
        <div id='migration' class='container'>
            <h2>Migration</h2>
            <canvas id='migration-canvas'></canvas>
        </div>
        <div id='infrastructure' class='container'>
            <h2>Infrastructure</h2>
        </div>
    </div>

    );


    function createToggle(selected_id) {
        var object = document.getElementById(selected_id['link_id']);
        object.onclick = function(){
            open_on_page(selected_id)
        };
    }
    
    function open_on_page(selected_id) {
        link_ids.forEach(function(link_id) {
            var section = document.getElementById(link_id['section_id']);
            var corresponding_link = document.getElementById(link_id['link_id']);
            if (selected_id['section_id'] === link_id['section_id']) {
                section.style.display = "block";
                corresponding_link.style.color = 'rgb(255,0,255)';
            } 
            else {
                section.style.display = "none";
                corresponding_link.style.color = '#2c3387';
            }  
        });
    
    }



}

export default MapProjections;

