const map = new maplibregl.Map({
  container: "map",
  style: "https://tile.openstreetmap.jp/styles/maptiler-basic-ja/style.json",
  center: [140.048, 35.828],
  zoom: 8.26,
  maxPitch: 85,
  hash: true,
  attributionControl: false,
});

map.addControl(new maplibregl.NavigationControl());
map.addControl(new maplibregl.FullscreenControl());
map.addControl(
  new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false,
    },
    fitBoundsOptions: { maxZoom: 18 },
    trackUserLocation: true,
    showUserLocation: true,
  })
);

map.addControl(
  new maplibregl.ScaleControl({
    maxWidth: 200,
    unit: "metric",
  })
);

map.addControl(
  new maplibregl.AttributionControl({
    compact: true,
    customAttribution:
      '（<a href="https://twitter.com/shi__works" target="_blank">X(旧Twitter)</a> | <a href="" target="_blank">GitHub</a>） ',
  })
);

map.addControl(
  new maplibregl.TerrainControl({
    source: "gsi-terrain-rgb",
    exaggeration: 1,
  })
);

map.on("load", () => {
  map.addSource("gsi-terrain-rgb", {
    type: "raster-dem",
    tiles: [
      "https://xs489works.xsrv.jp/raster-tiles/gsi/gsi-dem-terrain-rgb/{z}/{x}/{y}.png",
    ],
    tileSize: 256,
    attribution:
      "<a href='https://maps.gsi.go.jp/development/ichiran.html#dem' target='_blank'>地理院標高タイル</a>",
  });

  map.addLayer({
    id: "sea-level",
    type: "color-relief",
    source: "gsi-terrain-rgb",
    paint: {
      "color-relief-color": [
        "interpolate",
        ["linear"],
        ["elevation"],
        0,
        "rgba(0,127,255,0.5)",
        0.01,
        "rgba(0,0,0,0)",
      ],
      "color-relief-opacity": 1,
    },
  });
});

const slider = document.getElementById("elevation-slider");
const valueLabel = document.getElementById("elevation-value");
slider.addEventListener("input", (e) => {
  const seaLevel = +e.target.value;
  valueLabel.textContent = `${seaLevel}m`;

  map.setPaintProperty("sea-level", "color-relief-color", [
    "interpolate",
    ["linear"],
    ["elevation"],
    seaLevel,
    "rgba(0,127,255,0.5)",
    seaLevel + 0.01,
    "rgba(0,0,0,0)",
  ]);
});

const disclaimerButton = document.getElementById("disclaimer-button");
disclaimerButton.addEventListener("click", () => {
  alert(
    "本シミュレータは地形データで一定の高さ以下の場所を青く塗りつぶす処理をするだけのものであり、ハザードマップとは異なります。堤防等による防災対策や土砂の堆積等は考慮されていません。実際の洪水や津波発生時の危険性は各自治体が公表するハザードマップでご確認ください。"
  );
});
