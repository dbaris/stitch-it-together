
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
   const infrastructure_writeup = () => {
       return [
           <div>
               <p> 
               North America is a deeply connected infrastructural region. Infrastructure encompasses the systems that enable the movement of people, goods, and information. Its components trace the built environment and include connection mechanisms like roads, railways, watersheds, oil pipelines, and undersea cables. These systems allow for travel, digital communication, food systems transportation, access to drinking water, and availability of energy. Understanding infrastructural systems helps to loosen binary ways of thinking: natural and man-made, digital and physical, one country and another. For infrastructural networks, the border is not so much a barrier as a site of negotiation. Each of these systems finds a way to traverse the border and enable connection. These networks are constantly evolving and growing, adapting to new technologies and the always changing needs of people across North America's landscape.
               </p>
           </div>]
   }
   const migration_writeup = () => {
       return [
           <div>
               <p> 
               Instead of a land mass partitioned by nation states, what if we re-conceived of North America as a migratory region, one connected by systems and flows? The border line itself is a historical concept, one that has shifted over time. Though today's border feels permanent, it is in fact just one of many border lines and will inevitably change again and again and again. People cross these borders in astonishing numbers every day as they go to work, visit friends and family, and vacation across arbitrary lines. Though there are marked border crossing checkpoints, there are also moments where people cross the border at unknown points, unaccounted for and unknown by US Department of Transportation Statistics. Across the US and Mexico, an international network of detention centers and estaciones migratorias diffuses and operationalizes the border beyond the linear boundary. While the movement of people may be stopped at the border line, other non-humans are able to fly across and seep below. This map also includes the movement of monarch butterflies and watershed systems as a reminder that ecological systems are meant to migrate, shift, and flow.
               </p>
           </div>]
   }

   const writeups = {
       "migration" : migration_writeup(),
       "infrastructure": infrastructure_writeup(), 
       "map-projections": map_writeup(),
   }

   var link_ids = [
    {'link_id': 'global-projections-link', 'section_id': 'map-projections', title: "Map Projections"},
    {'link_id': 'migration-link', 'section_id': 'migration', title: "Migration" },
    {'link_id': 'infrastructure-link', 'section_id': 'infrastructure', title: "Infrastructure"}
];

const xGeo = (x1, y1, i, p) => {let x=x1; let y=y1; if(p) { x = p([x1,y1])[0]; y = p([x1,y1])[1];}
    return (`M ${x-i} ${y-i} L ${x+i} ${y+i} M ${x-i} ${y+i} L ${x+i} ${y-i}`)}
const triangleGeo = (x1, y1, i, p) => { let x=x1; let y=y1; if(p) { x = p([x1,y1])[0]; y = p([x1,y1])[1];} return (`M ${x} ${y-i} L ${x-(i*1.5)} ${y+i}  L ${x+(i*1.5)} ${y+i} Z`)} //[[x+(i*2), y-i],[x-(i*2), y-i]]])}
const verticalLineSerifGeo = (x1, y1, i, p) => { let x=x1; let y=y1; if(p) { x = p([x1,y1])[0]; y = p([x1,y1])[1];} return `M ${x} ${y+i} L ${x}  ${y-i} M ${x-(i/2)} ${y+i} L ${x+(i/2)} ${y+i}  M ${x-(i/2)} ${y-i} L ${x+(i/2)} ${y-i}`}
const horizontalLineSerifGeo = (x1, y1, i, p) => { let x=x1; let y=y1; if(p) { x = p([x1,y1])[0]; y = p([x1,y1])[1];} return ` M ${x+i} ${y} L ${x-i} ${y} M ${x+i} ${y+(i/2)} L ${x+i} ${y-(i/2)} M ${x-i} ${y-(i/2)} L ${x-i} ${y+(i/2)}`}

var migration_centers = {path: "./data/estaciones_migratorias.json", color: " #ec008c", opacity: "1", name: "Migration Centers", fill: false, icon_function: horizontalLineSerifGeo, classname: "migration"};
var ice_detention_centers = {path: "./data/ice_detention_centers.json", color: "#a00a15",opacity: "1", name: "Ice Detention Centers", fill: false, icon_function: verticalLineSerifGeo, classname: "ice"};
var butterfly = {path: "./data/butterfly.json", color: " #e6ac21", opacity: ".8", name: "Butterfly Migration", fill: false, icon_function: xGeo, classname: "butterfly"};
var big_lakes = {path: "./data/water/big_lakes.json", color: "#2a338a", opacity: ".8", name: "Big Lakes", fill: true , classname: "lake"};
var rivers = {path: "./data/water/rivers.json", color: " #658d5d", opacity: ".4", name: "Rivers", fill: false , classname: "river"};
var small_lakes = {path: "./data/water/small_lakes.json", color: "#2a338a",opacity: ".8", name: "Lakes", fill: true , classname: "lake"}; 

var historic_boarders = {path: "./data/historical_borders.json", color: "#658d5d", opacity: "1", name: "Historical Borders", fill: false, classname: "border", dash: "3 3", strokeWidth: "2.5"};
var undersea_cables = {path: "./data/undersea_cables.json", color: " #ec008c", opacity: ".8", name: 'Undersea Cables', fill: false, classname: "cables"};
var railroads = {path: "./data/railroads.json", color: "green", opacity: ".5", name: "Railroads", fill: false, classname: "railroads"};
var pipelines =  {path: "./data/pipelines.json", color: "#e6ac21", opacity: ".8", name: "Pipelines", fill: false , classname: "pipelines"};
var border_crossings = {path: "./data/border_crossings.json", color: "#a00a15", opacity: ".8", name: 'Border Crossings', fill: false, icon_function: triangleGeo, classname: "crossings"};

const migration_datasets = [migration_centers, ice_detention_centers, historic_boarders, butterfly, big_lakes, small_lakes, rivers]
const infrastructure_datasets = [undersea_cables, pipelines, big_lakes, rivers, small_lakes, border_crossings]

const datasets = {
    "migration": migration_datasets,
    'infrastructure': infrastructure_datasets,
    "map-projections": []
}

const map_config = {
    "migration": {"data": './data/north_america.json', "topojson":true, outline: true, name: "Migration"},
    'infrastructure': {"data": './data/north_america.json', "topojson":true, outline: true, name: "Infrastructure"},
    "map-projections": {"data": './data/world.json', "topojson":false, outline: false, name: "Map Projections"}
}

export {writeups, map_config, datasets, link_ids}


   