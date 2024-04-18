import React, { useEffect, useState } from 'react';
import "./MainPage.css"
import MapProjection from '../MapProjection/MapProjections.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import {Projection, projection_options} from "./projection.js";
import _ from 'lodash';

const NORTH_AMERICA = "north_america";
const WORLD = "world"

var link_ids = [
    {'link_id': 'global-projections-link', 'section_id': 'map-projections'},
    {'link_id': 'migration-link', 'section_id': 'migration'},
    {'link_id': 'infrastructure-link', 'section_id': 'infrastructure'}
];


function MainPage(props) {

    var init_page = link_ids[1];
    const p1 = new Projection('#ff0000', "Orthographic", 'global-projection1', d3.geoOrthographic);
    const p2 = new Projection('#d00df2', "Mercator", 'global-projection2', d3.geoMercator);
    const p3 = new Projection('#310df2', "Mercator", 'global-projection3', d3_geo_projection.geoBonne);
    const p4 = new Projection('#fdfd12', "Mercator", 'global-projection4', d3_geo_projection.geoMiller);
    const p5 = new Projection('#000000', "Equirectangular", 'global-projection4', d3.geoNaturalEarth1);
    const p6 = new Projection('#000000', "Equirectangular", 'global-projection6', d3.geoNaturalEarth1);

    const [page, setPage] = useState(init_page)
    const [projections, setProjections] = useState([p2, p1])


    
    useEffect( () => {
            link_ids.forEach(createToggle);
        }, [link_ids] 
    )

        
    useEffect( () => {
        console.log(projections)
    }, [projections]
)


    return (
        <div className='outer'>
        <div id='title'>
            <div id='title-text'>
                <h1> CounterMapping</h1>
                <div></div>
                <div><h2 style = {(page.link_id == 'global-projections-link') ? {color: 'rgb(255,0,255)'} : {}} 
                    className='page-link' id='global-projections-link'>1</h2></div>
                <div><h2 style = {(page.link_id == 'migration-link') ? {color: 'rgb(255,0,255)'} : {}} 
                    className='page-link' id='migration-link'>2</h2></div>
                <div><h2 style = {(page.link_id == 'infrastructure-link') ? {color: 'rgb(255,0,255)'} : {}} 
                    className='page-link' id='infrastructure-link'>3</h2></div>
            </div>
        </div>
        <div id='source-code'>
            <a href='https://github.com/dbaris/stitch-it-together'>Source Code</a>
        </div>
        <div className='container' id='map-projections'>
            <div id='map-projection-text'>
                <h2>{page['section_id']}</h2>
                <p>
                    Maps appear to be scientific documents: objective, singular points of truth that generate a sense of authority. However, every map is embedded with a set of constructed decisions that shape a particular narrative. These are not neutral decisions and neither are the images that they produce. Maps are as narrative tools that generate a particular reality, a particular truth.
                </p>
                <p>
                    Earth is a spherical object. To represent this orb in flattened form, projection algorithms convert three-dimensional points to a two-dimensional representation, with different algorithms producing different representations. While some projections maintain geographic scale, others produce size distortions that dramatically under-scale some nations while enlarging others.
                </p>
                <GenerateForms/>
                <div className='sources'>
                    <p>Sources:</p>
                    <a href="https://observablehq.com/@d3/projection-comparison">Observable Projection Comparison Tutorial</a>
                    <p>Snyder, John. Map Projections: A Working Manual. US GPO, 1987.</p>
                </div>
            </div>

            <MapProjection projections = {projections} data_type= {(page.section_id === "map-projections") ? WORLD : NORTH_AMERICA} id={"map_projections"}/>
        </div>
    </div>

    );


    function createToggle(selected_id) {
        var object = document.getElementById(selected_id['link_id']);
        object.onclick = function(){
            setPage(selected_id)
        };
    }

    
    function GenerateForms() {
        var content = []
        var i = 0;
        for(var p of projections) {
            content.push(
                <form key = {p.name + "-form"}>
                    <select id={p.form_id_tag+i} value={p.name} onChange={projectionChange}>
                        {projection_options.map(po => {
                                return <option key={po.name + "option"} value={po.name}>{po.name}</option> 

                        })}
                    </select>
                    <input id={p.color_id_tag+i} type="color" value={p.color} onChange={colorChange}/>
                    <p>{p.description}</p>
                </form>
            )
            i +=1;
        }
        return content;
    } 

    function colorChange(e) {
        console.log(e.target.id)
        let idx = parseInt(e.target.id.charAt(e.target.id.length - 1));
        let color = e.target.value
        console.log(idx)
        console.log(e.target.value)
        var new_projections = JSON.parse(JSON.stringify(projections))
        new_projections[idx].color = color;
        new_projections.map((p,i) => {p.projection = projections[i].projection})
        setProjections(new_projections)

    }
    function getDescription(projection_name) {
        var description = '';
        projection_options.forEach(function(p) {
          if (p['name'] == projection_name) {
            description = p['description'];
          }
        })
        return description;
      }
    function projectionChange(e) {
        let idx = parseInt(e.target.id.charAt(e.target.id.length - 1));
        let name = e.target.value;
        console.log(idx)
        console.log(name)
        var new_projections = JSON.parse(JSON.stringify(projections))
        new_projections[idx].name = name
        new_projections[idx].description = getDescription(name)
        new_projections.map((p,i) => {p.projection = projections[i].projection})
        let po = _.find(projection_options, function(o) { return o.name === name; });
        new_projections[idx].projection = po.value()
        setProjections(new_projections)
    }



}

export default MainPage;

