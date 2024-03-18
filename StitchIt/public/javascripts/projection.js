import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3_geo_projection from "https://cdn.skypack.dev/d3-geo-projection@4";

var projections = [
    {name: "Airy’s minimum error", value: d3_geo_projection.geoAiry},
    {name: "Aitoff", value: d3_geo_projection.geoAitoff},
    {name: "American polyconic", value: d3_geo_projection.geoPolyconic},
    {name: "armadillo", value: d3_geo_projection.geoArmadillo},
    {name: "August", value: d3_geo_projection.geoAugust},
    {name: "Azimuthal Equal-Area", value: d3.geoAzimuthalEqualArea},
    {name: "Azimuthal Equidistant", value: d3.geoAzimuthalEquidistant},
    {name: "Baker dinomic", value: d3_geo_projection.geoBaker},
    {name: "Berghaus’ star", value: d3_geo_projection.geoBerghaus},
    {name: "Bertin’s 1953", value: d3_geo_projection.geoBertin1953},
    {name: "Boggs’ eumorphic", value: d3_geo_projection.geoBoggs},
    {name: "Boggs’ eumorphic (interrupted)", value: d3_geo_projection.geoInterruptedBoggs},
    {name: "Bonne", value: d3_geo_projection.geoBonne},
    {name: "Bottomley", value: d3_geo_projection.geoBottomley},
    {name: "Bromley", value: d3_geo_projection.geoBromley},
    {name: "Butterfly (gnomonic)", value: d3_geo_projection.geoPolyhedralButterfly},
    {name: "Butterfly (Collignon)", value: d3_geo_projection.geoPolyhedralCollignon},
    {name: "Butterfly (Waterman)", value: d3_geo_projection.geoPolyhedralWaterman},
    {name: "Collignon", value: d3_geo_projection.geoCollignon},
    // {name: "conic conformal", value: d3.geoConicConformal}, // Not suitable for world maps.
    {name: "Conic Equal-Area", value: d3.geoConicEqualArea},
    {name: "Conic Equidistant", value: d3.geoConicEquidistant},
    {name: "Craig retroazimuthal", value: d3_geo_projection.geoCraig},
    {name: "Craster parabolic", value: d3_geo_projection.geoCraster},
    {name: "cylindrical equal-area", value: d3_geo_projection.geoCylindricalEqualArea},
    {name: "cylindrical stereographic", value: d3_geo_projection.geoCylindricalStereographic},
    {name: "Eckert I", value: d3_geo_projection.geoEckert1},
    {name: "Eckert II", value: d3_geo_projection.geoEckert2},
    {name: "Eckert III", value: d3_geo_projection.geoEckert3},
    {name: "Eckert IV", value: d3_geo_projection.geoEckert4},
    {name: "Eckert V", value: d3_geo_projection.geoEckert5},
    {name: "Eckert VI", value: d3_geo_projection.geoEckert6},
    {name: "Eisenlohr conformal", value: d3_geo_projection.geoEisenlohr},
    {name: "Equal Earth", value: d3.geoEqualEarth},
    {name: "Equirectangular (plate carrée)", value: d3_geo_projection.geoEquirectangular},
    {name: "Fahey pseudocylindrical", value: d3_geo_projection.geoFahey},
    {name: "flat-polar parabolic", value: d3_geo_projection.geoMtFlatPolarParabolic},
    {name: "flat-polar quartic", value: d3_geo_projection.geoMtFlatPolarQuartic},
    {name: "flat-polar sinusoidal", value: d3_geo_projection.geoMtFlatPolarSinusoidal},
    {name: "Foucaut’s stereographic equivalent", value: d3_geo_projection.geoFoucaut},
    {name: "Foucaut’s sinusoidal", value: d3_geo_projection.geoFoucautSinusoidal},
    {name: "general perspective", value: d3_geo_projection.geoSatellite},
    {name: "Gilbert’s two-world", value: d3_geo_projection.geoGilbert},
    {name: "Gingery", value: d3_geo_projection.geoGingery},
    {name: "Ginzburg V", value: d3_geo_projection.geoGinzburg5},
    {name: "Ginzburg VI", value: d3_geo_projection.geoGinzburg6},
    {name: "Ginzburg VIII", value: d3_geo_projection.geoGinzburg8},
    {name: "Ginzburg IX", value: d3_geo_projection.geoGinzburg9},
    {name: "Goode’s homolosine", value: d3_geo_projection.geoHomolosine},
    {name: "Goode’s homolosine (interrupted)", value: d3_geo_projection.geoInterruptedHomolosine},
    {name: "gnomonic", value: d3_geo_projection.geoGnomonic},
    {name: "Gringorten square", value: d3_geo_projection.geoGringorten},
    {name: "Gringorten quincuncial", value: d3_geo_projection.geoGringortenQuincuncial},
    {name: "Guyou square", value: d3_geo_projection.geoGuyou},
    {name: "Hammer", value: d3_geo_projection.geoHammer},
    {name: "Hammer retroazimuthal", value: d3_geo_projection.geoHammerRetroazimuthal},
    {name: "HEALPix", value: d3_geo_projection.geoHealpix},
    {name: "Hill eucyclic", value: d3_geo_projection.geoHill},
    {name: "Hufnagel pseudocylindrical", value: d3_geo_projection.geoHufnagel},
    {name: "Kavrayskiy VII", value: d3_geo_projection.geoKavrayskiy7},
    {name: "Lagrange conformal", value: d3_geo_projection.geoLagrange},
    {name: "Larrivée", value: d3_geo_projection.geoLarrivee},
    {name: "Laskowski tri-optimal", value: d3_geo_projection.geoLaskowski},
    // {name: "Littrow retroazimuthal", value: d3.geoLittrow}, // Not suitable for world maps.
    {name: "Loximuthal", value: d3_geo_projection.geoLoximuthal},
    {name: "Mercator", value: d3.geoMercator},
    {name: "Miller cylindrical", value: d3_geo_projection.geoMiller},
    {name: "Mollweide", value: d3_geo_projection.geoMollweide},
    {name: "Mollweide (Goode’s interrupted)", value: d3_geo_projection.geoInterruptedMollweide},
    {name: "Mollweide (interrupted hemispheres)", value: d3_geo_projection.geoInterruptedMollweideHemispheres},
    {name: "Natural Earth", value: d3.geoNaturalEarth1},
    {name: "Natural Earth II", value: d3_geo_projection.geoNaturalEarth2},
    {name: "Nell–Hammer", value: d3_geo_projection.geoNellHammer},
    {name: "Nicolosi globular", value: d3_geo_projection.geoNicolosi},
    {name: "Orthographic", value: d3.geoOrthographic},
    {name: "Patterson cylindrical", value: d3_geo_projection.geoPatterson},
    {name: "Peirce quincuncial", value: d3_geo_projection.geoPeirceQuincuncial},
    {name: "rectangular polyconic", value: d3_geo_projection.geoRectangularPolyconic},
    {name: "Robinson", value: d3_geo_projection.geoRobinson},
    {name: "Sinusoidal", value: d3_geo_projection.geoSinusoidal},
    {name: "Sinusoidal (interrupted)", value: d3_geo_projection.geoInterruptedSinusoidal},
    {name: "Sinu-Mollweide", value: d3_geo_projection.geoSinuMollweide},
    {name: "Sinu-Mollweide (interrupted)", value: d3_geo_projection.geoInterruptedSinuMollweide},
    {name: "Stereographic", value: d3.geoStereographic},
    {name: "Times", value: d3_geo_projection.geoTimes},
    {name: "Tobler hyperelliptical", value: d3_geo_projection.geoHyperelliptical},
    {name: "Transverse Mercator", value: d3.geoTransverseMercator},
    {name: "Van der Grinten", value: d3_geo_projection.geoVanDerGrinten},
    {name: "Van der Grinten II", value: d3_geo_projection.geoVanDerGrinten2},
    {name: "Van der Grinten III", value: d3_geo_projection.geoVanDerGrinten3},
    {name: "Van der Grinten IV", value: d3_geo_projection.geoVanDerGrinten4},
    {name: "Wagner IV", value: d3_geo_projection.geoWagner4},
    {name: "Wagner VI", value: d3_geo_projection.geoWagner6},
    {name: "Wagner VII", value: d3_geo_projection.geoWagner7},
    {name: "Werner", value: () => d3_geo_projection.geoBonne().parallel(90)},
    {name: "Wiechel", value: d3_geo_projection.geoWiechel},
    {name: "Winkel tripel", value: d3_geo_projection.geoWinkel3}
];

class Projection {
  constructor(color, name, id_tag, projection, callback) {
    this.color = color;
    this.name = name;
    this.id_tag = id_tag;
    this.projection = projection();
    this.form_id_tag = id_tag + 'form';
    this.color_id_tag = id_tag + 'color';
    this.line_dash = [0,0];
    this.callback = callback;
    this.generateForm();
  }

  setLineDash(dash){
    this.line_dash = dash;
  }

  generateForm() {
    console.log(this.color);
    const form = 
    `<form>
      <select id=${this.form_id_tag}>${projections.map(p => {
          return `<option textContent=${p.name} ${(this.name == p.name) ? 'selected' : ''}> ${p.name} </option>`;
      })}</select>
      <form>
      <input id=${this.color_id_tag} type="color" value="${this.color}"></input>`
      ;
    document.getElementById(this.id_tag).innerHTML = form;
    document.getElementById(this.form_id_tag).addEventListener("change", (e) => this.updateProjection(e));
    document.getElementById(this.color_id_tag).addEventListener("change", (e) => this.updateProjection(e))
  } 

  updateProjection(e) {
    var form = document.getElementById(this.form_id_tag);
    this.name = form.options[form.selectedIndex].text;
    this.projection = projections[form.selectedIndex].value();

    var color = document.getElementById(this.color_id_tag);
    this.color = color.value;
    this.callback();
  }
}

export { projections, Projection };
