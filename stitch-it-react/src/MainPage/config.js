
const map_writeup = () => {
    return [
       <div>
           <p> 
               Maps appear to be scientific documents: objective, singular points of truth that generate a sense of authority. However, every map is embedded with a set of constructed decisions that shape a particular narrative. These are not neutral decisions and neither are the images that they produce. Maps are as narrative tools that generate a particular reality, a particular truth.
                   </p>
           <p>
           Earth is a spherical object. To represent this orb in flattened form, projection algorithms convert three-dimensional points to a two-dimensional representation, with different algorithms producing different representations. While some projections maintain geographic scale, others produce size distortions that dramatically under-scale some nations while enlarging others.
           </p> 
       </div>]
   }
   const migration_writeup = () => {
       return [
           <div>
               <p> 
                   Migration Writeup Here
               </p>
           </div>]
   }
   const infrastructure_writeup = () => {
       return [
           <div>
               <p> 
                   Infrastructure Writeup Here
               </p>
           </div>]
   }

   const writeups = {
       "migration" : migration_writeup(),
       "infrastructure": infrastructure_writeup(), 
       "map-projections": map_writeup(),
   }

   var link_ids = [
    {'link_id': 'global-projections-link', 'section_id': 'map-projections'},
    {'link_id': 'migration-link', 'section_id': 'migration'},
    {'link_id': 'infrastructure-link', 'section_id': 'infrastructure'}
];

const xGeo = (x1, y1, i, p) => {let x=x1; let y=y1; if(p) { x = p([x1,y1])[0]; y = p([x1,y1])[1];}
    return (`M ${x-i} ${y-i} L ${x+i} ${y+i} M ${x-i} ${y+i} L ${x+i} ${y-i}`)}
const triangleGeo = (x1, y1, i, p) => { let x=x1; let y=y1; if(p) { x = p([x1,y1])[0]; y = p([x1,y1])[1];} return (`M ${x} ${y-i} L ${x-(i*1.5)} ${y+i}  L ${x+(i*1.5)} ${y+i} Z`)} //[[x+(i*2), y-i],[x-(i*2), y-i]]])}
const verticalLineSerifGeo = (x1, y1, i, p) => { let x=x1; let y=y1; if(p) { x = p([x1,y1])[0]; y = p([x1,y1])[1];} return `M ${x} ${y+i} L ${x}  ${y-i} M ${x-(i/2)} ${y+i} L ${x+(i/2)} ${y+i}  M ${x-(i/2)} ${y-i} L ${x+(i/2)} ${y-i}`}
const horizontalLineSerifGeo = (x1, y1, i, p) => { let x=x1; let y=y1; if(p) { x = p([x1,y1])[0]; y = p([x1,y1])[1];} return ` M ${x+i} ${y} L ${x-i} ${y} M ${x+i} ${y+(i/2)} L ${x+i} ${y-(i/2)} M ${x-i} ${y-(i/2)} L ${x-i} ${y+(i/2)}`}

var migration_centers = {path: "./data/estaciones_migratorias.json", color: "green", opacity: "1", name: "migration centers", icon_function: horizontalLineSerifGeo};
var ice_detention_centers = {path: "./data/ice_detention_centers.json", color: "brown",opacity: "1", name: "ice detention centers", icon_function: verticalLineSerifGeo};
var butterfly = {path: "./data/butterfly.json", color: "orange", opacity: ".5", name: "butterfly migration", icon_function: xGeo};
var big_lakes = {path: "./data/water/big_lakes.json", color: "blue", opacity: ".4", name: "big lakes"};
var rivers = {path: "./data/water/rivers.json", color: "#34a1eb", opacity: ".3", name: "rivers"};
var small_lakes = {path: "./data/water/small_lakes.json", color: "blue",opacity: ".4", name: "small lakes"}; 
var historic_boarders = {path: "./data/historical_borders.json", color: "red", opacity: "1", name: "historical borders"};
var undersea_cables = {path: "./data/undersea_cables.json", color: "purple", opacity: ".5", name: 'undersea cables'};
var railroads = {path: "./data/railroads.json", color: "green", opacity: ".5", name: "railroads"};
var pipelines =  {path: "./data/pipelines.json", color: "orange", opacity: ".8", name: "pipelines"};
var border_crossings = {path: "./data/border_crossings.json", color: "brown", opacity: ".8", name: 'border crossings', icon_function: triangleGeo};

const migration_datasets = [migration_centers, ice_detention_centers, railroads, historic_boarders, big_lakes, rivers, small_lakes, butterfly]
const infrastructure_datasets = [undersea_cables, pipelines, big_lakes, rivers, small_lakes, border_crossings]

const datasets = {
    "migration": migration_datasets,
    'infrastructure': infrastructure_datasets,
    "map-projections": []
}

const map_config = {
    "migration": {"data": './data/north_america.json', "topojson":true, outline: true},
    'infrastructure': {"data": './data/north_america.json', "topojson":true, outline: true},
    "map-projections": {"data": './data/world.json', "topojson":false, outline: false}
}

export {writeups, map_config, datasets, link_ids}


   