protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
  container: "map",
  style: "std.json",
  center: [139.8304, 35.7103],
  zoom: 11.33,
  maxPitch: 85,
  hash: true,
  attributionControl: false
});

map.addControl(new maplibregl.NavigationControl());
map.addControl(new maplibregl.FullscreenControl());
map.addControl(new maplibregl.GeolocateControl({
  positionOptions: { enableHighAccuracy: false },
  fitBoundsOptions: { maxZoom: 18 },
  trackUserLocation: true,
  showUserLocation: true
}));
map.addControl(new maplibregl.ScaleControl({ maxWidth: 200, unit: "metric" }));

const gsiAttribution = "<a href='https://maps.gsi.go.jp/development/ichiran.html#dem' target='_blank'>国土地理院 標高タイル</a>";
const gsjAttribution = "<a href='https://tiles.gsj.jp/tiles/elev/tiles.html#h_land' target='_blank'>産業技術総合研究所 シームレス標高タイル</a>";
const defaultLinks = '（<a href="https://twitter.com/shi__works" target="_blank">X(旧Twitter)</a> | <a href="https://github.com/shiwaku/japan-sea-level-rise-map-on-maplibre" target="_blank">GitHub</a>）';

let attributionControl = new maplibregl.AttributionControl({
  compact: true,
  customAttribution: `${gsiAttribution} ${defaultLinks}`
});
map.addControl(attributionControl, 'bottom-right');

let terrainControl = new maplibregl.TerrainControl({
  source: "elevation",
  exaggeration: 1
});
map.addControl(terrainControl);

map.on("load", () => {
  map.addSource("elevation", {
    type: "raster-dem",
    tiles: [
      "https://xs489works.xsrv.jp/raster-tiles/gsi/gsi-dem-terrain-rgb/{z}/{x}/{y}.png"
    ],
    tileSize: 256,
    attribution: gsiAttribution
  });

  map.addLayer({
    id: "sea-level",
    type: "color-relief",
    source: "elevation",
    paint: {
      "color-relief-color": [
        "interpolate", ["linear"], ["elevation"],
        0, "rgba(0,0,152,0.5)",
        0.01, "rgba(255,255,255,0)"
      ],
      "color-relief-opacity": 1
    }
  });

  map.setTerrain({ source: "elevation", exaggeration: 1 });

  const slider = document.getElementById("elevation-slider");
  const valueLabel = document.getElementById("elevation-value");
  slider.addEventListener("input", (e) => {
    const h = +e.target.value;
    valueLabel.textContent = `${h}m`;
    map.setPaintProperty("sea-level", "color-relief-color", [
      "interpolate", ["linear"], ["elevation"],
      h, "rgba(0,0,152,0.5)",
      h + 0.01, "rgba(255,255,255,0)"
    ]);
  });

  const selector = document.getElementById("source-selector");
  selector.addEventListener("change", (e) => {
    const newURL = e.target.value;
    const isGSI = newURL.includes("gsi-dem-terrain-rgb");
    const newSrcAttribution = isGSI ? gsiAttribution : gsjAttribution;

    map.removeControl(attributionControl);
    attributionControl = new maplibregl.AttributionControl({
      compact: true,
      customAttribution: `${newSrcAttribution} ${defaultLinks}`
    });
    map.addControl(attributionControl, 'bottom-right');

    const src = map.getSource("elevation");
    src.tiles = [newURL];
    src.attribution = newSrcAttribution;

    const cache = map.style.sourceCaches["elevation"];
    cache.clearTiles();
    cache.reload();

    map.setTerrain({ source: "elevation", exaggeration: 1 });
  });

  document.getElementById("disclaimer-button").addEventListener("click", () => {
    alert(
      "本シミュレータは地形データで一定の高さ以下の場所を青く塗りつぶす処理をするだけのものであり、ハザードマップとは異なります。" +
      "堤防等による防災対策や土砂の堆積等は考慮されていません。実際の洪水や津波発生時の危険性は各自治体が公表するハザードマップでご確認ください。"
    );
  });

  map.setSky({
    "sky-color": "#199EF3",
    "sky-horizon-blend": 0.7,
    "horizon-color": "#f0f8ff",
    "horizon-fog-blend": 0.8,
    "fog-color": "#2c7fb8",
    "fog-ground-blend": 0.9,
    "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 12, 0],
  });
});
