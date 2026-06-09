import {
    useEffect,
    useCallback,
    useLayoutEffect,
    useRef,
    useState
  } from "react";
  import * as React from "react";

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";
import {Projection, projection_options} from "./MainPage/projection"


var migration_centers = {path: "./data/estaciones_migratorias.json", color: "green", opacity: "1", name: "migration centers"};
var ice_detention_centers = {path: "./data/ice_detention_centers.json", color: "yellow",opacity: "1", name: "ice detention centers"};
var butterfly = {path: "./data/butterfly.json", color: "pink", opacity: ".3", name: "butterfly migration"};
var big_lakes = {path: "./data/water/big_lakes.json", color: "blue", opacity: ".2", name: "big lakes"};
var rivers = {path: "./data/water/rivers.json", color: "#34a1eb", opacity: ".2", name: "rivers"};
var small_lakes = {path: "./data/water/small_lakes.json", color: "blue",opacity: ".2", name: "small lakes"}; 
var historic_boarders = {path: "./data/historical_borders.json", color: "red", opacity: "1", name: "historical borders"};
var undersea_cables = {path: "./data/undersea_cables.json", color: "purple", opacity: ".5", name: 'undersea cables'};
var railroads = {path: "./data/railroads.json", color: "green", opacity: ".2", name: "railroads"};
var pipelines =  {path: "./data/pipelines.json", color: "orange", opacity: ".8", name: "pipelines"};
var border_crossings = {path: "./data/border_crossings.json", color: "brown", opacity: ".8", name: 'border crossings'};

const migration_datasets = [butterfly, migration_centers, ice_detention_centers, railroads, historic_boarders, big_lakes, rivers, small_lakes]
const infrastructure_datasets = [undersea_cables, pipelines, big_lakes, rivers, small_lakes, border_crossings]

const p = new Projection('black', "Miller Cylandrical", 'global-projection4', d3_geo_projection.geoMiller);

const datasets = {
    "migration": migration_datasets,
    'infrastructure': infrastructure_datasets,
    "map-projections": []
}
var all_data;
  
// const CanvasProps = {
//     canvasWidth: number;
//     canvasHeight: number;
//   };
  
// const Point = {
//     x: number;
//     y: number;
//   };
  
  const ORIGIN = Object.freeze({ x: 0, y: 0 });
  
  // adjust to device to avoid blur
  const { devicePixelRatio: ratio = 1 } = window;
  
  function diffPoints(p1, p2) {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
  }
  
  function addPoints(p1, p2) {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
  }
  
  function scalePoint(p1, scale) {
    return { x: p1.x / scale, y: p1.y / scale };
  }
  
  const ZOOM_SENSITIVITY = 500; // bigger for lower zoom per scroll
  
  export default function Zoom(props) {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState(ORIGIN);
    const [mousePos, setMousePos] = useState(ORIGIN);
    const [viewportTopLeft, setViewportTopLeft] = useState(ORIGIN);
    const isResetRef = useRef(false);
    const lastMousePosRef = useRef(ORIGIN);
    const lastOffsetRef = useRef(ORIGIN);
  
    // update last offset
    useEffect(() => {
      lastOffsetRef.current = offset;
    }, [offset]);
  
    // reset
    const reset = useCallback(
      (context) => {
        if (context && !isResetRef.current) {
          // adjust for device pixel density
          context.canvas.width = props.canvasWidth * ratio;
          context.canvas.height = props.canvasHeight * ratio;
          context.scale(ratio, ratio);
          setScale(1);
  
          // reset state and refs
          setContext(context);
          setOffset(ORIGIN);
          setMousePos(ORIGIN);
          setViewportTopLeft(ORIGIN);
          lastOffsetRef.current = ORIGIN;
          lastMousePosRef.current = ORIGIN;
  
          // this thing is so multiple resets in a row don't clear canvas
          isResetRef.current = true;
        }
      },
      [props.canvasWidth, props.canvasHeight]
    );
  
    // functions for panning
    const mouseMove = useCallback(
      (event) => {
        if (context) {
          const lastMousePos = lastMousePosRef.current;
          const currentMousePos = { x: event.pageX, y: event.pageY }; // use document so can pan off element
          lastMousePosRef.current = currentMousePos;
  
          const mouseDiff = diffPoints(currentMousePos, lastMousePos);
          setOffset((prevOffset) => addPoints(prevOffset, mouseDiff));
        }
      },
      [context]
    );
  
    const mouseUp = useCallback(() => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    }, [mouseMove]);
  
    const startPan = useCallback(
      (event) => {
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
        lastMousePosRef.current = { x: event.pageX, y: event.pageY };
      },
      [mouseMove, mouseUp]
    );
  
    // setup canvas and set context
    useLayoutEffect(() => {
      if (canvasRef.current) {
        // get new drawing context
        const renderCtx = canvasRef.current.getContext("2d");
  
        if (renderCtx) {
          reset(renderCtx);
        }
      }
    }, [reset, props.canvasHeight, props.canvasWidth]);
  
    // pan when offset or scale changes
    useLayoutEffect(() => {
      if (context && lastOffsetRef.current) {
        const offsetDiff = scalePoint(
          diffPoints(offset, lastOffsetRef.current),
          scale
        );
        context.translate(offsetDiff.x, offsetDiff.y);
        setViewportTopLeft((prevVal) => diffPoints(prevVal, offsetDiff));
        isResetRef.current = false;
      }
    }, [context, offset, scale]);
  
    // draw
    useLayoutEffect(() => {
      if (context) {
        const squareSize = 20;
  
        // clear canvas but maintain transform
        const storedTransform = context.getTransform();
        context.canvas.width = context.canvas.width;
        context.setTransform(storedTransform);
        renderFeatureCollection(migration_centers, p.projection, context, "blue")
        context.fillRect(
          props.canvasWidth / 2 - squareSize / 2,
          props.canvasHeight / 2 - squareSize / 2,
          squareSize,
          squareSize
        );
        context.arc(viewportTopLeft.x, viewportTopLeft.y, 5, 0, 2 * Math.PI);
        // context.fillStyle = "red";
        // context.fill();
      }
    }, [
      props.canvasWidth,
      props.canvasHeight,
      context,
      scale,
      offset,
      viewportTopLeft
    ]);
  
    // add event listener on canvas for mouse position
    useEffect(() => {
      const canvasElem = canvasRef.current;
      if (canvasElem === null) {
        return;
      }
  
      function handleUpdateMouse(event) {
        event.preventDefault();
        if (canvasRef.current) {
          const viewportMousePos = { x: event.clientX, y: event.clientY };
          const topLeftCanvasPos = {
            x: canvasRef.current.offsetLeft,
            y: canvasRef.current.offsetTop
          };
          setMousePos(diffPoints(viewportMousePos, topLeftCanvasPos));
        }
      }
  
      canvasElem.addEventListener("mousemove", handleUpdateMouse);
      canvasElem.addEventListener("wheel", handleUpdateMouse);
      return () => {
        canvasElem.removeEventListener("mousemove", handleUpdateMouse);
        canvasElem.removeEventListener("wheel", handleUpdateMouse);
      };
    }, []);
  
    // add event listener on canvas for zoom
    useEffect(() => {
      const canvasElem = canvasRef.current;
      if (canvasElem === null) {
        return;
      }
  
      // this is tricky. Update the viewport's "origin" such that
      // the mouse doesn't move during scale - the 'zoom point' of the mouse
      // before and after zoom is relatively the same position on the viewport
      function handleWheel(event) {
        event.preventDefault();
        if (context) {
          const zoom = 1 - event.deltaY / ZOOM_SENSITIVITY;
          const viewportTopLeftDelta = {
            x: (mousePos.x / scale) * (1 - 1 / zoom),
            y: (mousePos.y / scale) * (1 - 1 / zoom)
          };
          const newViewportTopLeft = addPoints(
            viewportTopLeft,
            viewportTopLeftDelta
          );
  
          context.translate(viewportTopLeft.x, viewportTopLeft.y);
          context.scale(zoom, zoom);
          context.translate(-newViewportTopLeft.x, -newViewportTopLeft.y);
  
          setViewportTopLeft(newViewportTopLeft);
          setScale(scale * zoom);
          isResetRef.current = false;
        }
      }
  
      canvasElem.addEventListener("wheel", handleWheel);
      return () => canvasElem.removeEventListener("wheel", handleWheel);
    }, [context, mousePos.x, mousePos.y, viewportTopLeft, scale]);
  
    function renderFeatureCollection(d, projection, context, color) {
        if(!all_data) {
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
                context.beginPath(); path(json); context.globalAlpha = d.opacity; context.stroke();
                    // *** rendering different projections *** //
                context.restore();
                all_data = json
                // d3.select("svg").selectAll("circle.cities").data(customerListData.features)
                // .enter()
                // .append("circle")
                // .attr("r", 5)
                // .attr("cx", function(d) {return projection([d.geometry.coordinates])[0]})
                // .attr("cy", function(d) {return projection([d.geometry.coordinates])[1]})
                // .on("click", function(d) {console.log(d)})
            })
        }
        else {
            // console.log("new")
            context.save();
            // console.log(geometries[i])
            const path = d3.geoPath(projection, context);
            context.strokeStyle = d.color;
            context.beginPath(); path(all_data); context.globalAlpha = d.opacity; context.stroke();
                // *** rendering different projections *** //
            context.restore();
        }
    }
    
 
    return (
      <div>
        <button onClick={() => context && reset(context)}>Reset</button>
        <pre>scale: {scale}</pre>
        <pre>offset: {JSON.stringify(offset)}</pre>
        <pre>viewportTopLeft: {JSON.stringify(viewportTopLeft)}</pre>
        <canvas
          onMouseDown={startPan}
          ref={canvasRef}
          width={props.canvasWidth * ratio}
          height={props.canvasHeight * ratio}
          style={{
            border: "2px solid #000",
            width: `${props.canvasWidth}px`,
            height: `${props.canvasHeight}px`
          }}
        ></canvas>
      </div>
    );
  }
  