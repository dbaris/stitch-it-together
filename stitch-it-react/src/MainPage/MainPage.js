import React, { useEffect, useState } from 'react';
import "./MainPage.css"
import MapProjectionSVG from '../MapProjection/MapProjectionsSVG.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import {Projection, projection_options} from "./projection.js";
import {writeups, map_config, datasets, link_ids} from "./config.js";
import _ from 'lodash';



function MainPage(props) {

    var init_page = 0;

    // migration // infrastructure
    const p1 = new Projection('#ff0000', "Orthographic", 'global-projection1', d3.geoOrthographic, "0", "1", ".5");
    const p4 = new Projection('white', "Miller Cylandrical", 'global-projection4', d3_geo_projection.geoMiller, "0", "1", "1");
    const p7 = new Projection('#d00df2', "Mercator", 'global-projection2', d3.geoMercator, "0", "1", ".5");
    // map-projections
    const p5 = new Projection('white', "Equirectangular", 'global-projection4', d3.geoNaturalEarth1, "3 3", ".5", 0);
    const p2 = new Projection('white', "Mercator", 'global-projection2', d3.geoMercator, "2, 6, 6, 10", ".5", 0);

    const init_projections = {
        "migration" : [p4, p5, p2],
        "infrastructure": [p4], 
        "map-projections": [p1, p7]
    }

    const [page, setPage] = useState(null)
    const [projections, setProjections] = useState(init_projections[link_ids[init_page].section_id])


    useEffect( () => {
            link_ids.forEach(createToggle);
        }, [link_ids] 
    )

        
    useEffect( () => {
        // console.log(projections)
    }, [projections]
)


    return (
    <div className='outer'>
        {/********************************************* 
                            Nav Menu
        *********************************************/}
        {/* position absolute */}
        <div id='title'>
            <div id='title-text'>
                <h1>Stitch It Together: CounterMapping</h1>
                <div></div>
                <div><h2 style = {(page && page.link_id == 'global-projections-link') ? {color: 'rgb(255,0,255)'} : {}} 
                    className='page-link' id='global-projections-link'>1</h2></div>
                <div><h2 style = {( page &&  page.link_id == 'migration-link') ? {color: 'rgb(255,0,255)'} : {}} 
                    className='page-link' id='migration-link'>2</h2></div>
                <div><h2 style = {( page && page.link_id == 'infrastructure-link') ? {color: 'rgb(255,0,255)'} : {}} 
                    className='page-link' id='infrastructure-link'>3</h2></div>
            </div>
        </div>
        {/********************************************* 
                    Write Up & Forms
        *********************************************/}
        { page &&
            <div>
                {/* position absolute */}
                <div id='source-code'>
                    <a href='https://github.com/dbaris/stitch-it-together'>Source Code</a>
                </div>
                <div id="left">
                    <div className='container' id='map-projections'>
                        <div id='map-projection-text'>
                            <h2 >{page['title']}</h2>
                            <div key={"writeup"}>{writeups[page['section_id']]}</div>
                            {page.section_id === "map-projections" && <GenerateForms/> }
                            {page.section_id === "map-projections" &&
                            <div className='sources'>
                                <p>Sources:</p>
                                <a href="https://observablehq.com/@d3/projection-comparison">Observable Projection Comparison Tutorial</a>
                                <p>Snyder, John. Map Projections: A Working Manual. US GPO, 1987.</p>
                            </div> }
                            {/********************************************* 
                                                Index 
                            *********************************************/}
                            {datasets[page.section_id].length >0 &&  <div>
                                <h2>Index</h2>
                                <Index/>
                            </div>
                            }
                            {/* <Zoom canvasWidth='600' canvasHeight='400'/> */}
                        </div>
                    </div>
                </div>
                <div id="right">
                    {/********************************************* 
                                    Map Canvas
                    *********************************************/}
                    <MapProjectionSVG 
                        projections = {projections} 
                        config = {map_config[page.section_id]}
                        dataset_paths = {datasets[page.section_id]}
                        id={"map_projections"}/>
                </div>
            </div>
        }
    </div>

    );


    function createToggle(selected_id) {
        var object = document.getElementById(selected_id['link_id']);
        object.onclick = function(){
            setPage(selected_id)
            var ps = init_projections[selected_id.section_id]
            setProjections(ps)
 
        };
    }
    function Index() {
        var ds = datasets[page.section_id]
        var content = []
        for(var d of ds) {
            if(d.name === "Big Lakes") {
                continue;
            }
            content.push(
            <svg height="50" width="500" xmlns="http://www.w3.org/2000/svg">
                <path d={(d.icon_function) ? d.icon_function(20, 10, 5, null): "M 15 10 L 30 10"} fill={"none"} stroke={d.color} strokeWidth={2.5} />
                <text x="50" y="10">{d.name}</text>
            </svg>)
        }
        return content;
    }
    
    function GenerateForms() {
        var content = []
        var i = 0;
        for(var p of projections) {
            content.push(
                <form key = {p.name + "-form" + i}>
                    <select key={p.name + "select"+ i} id={p.form_id_tag+i} value={p.name} onChange={projectionChange}>
                        {projection_options.map(po => {
                                return <option key={po.name + "option" + i} value={po.name}>{po.name}</option> 

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
        let idx = parseInt(e.target.id.charAt(e.target.id.length - 1));
        let color = e.target.value
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

