import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';

import { elevationSources, DEFAULT_LINKS } from './config/elevation-sources';
import { createMap, applySky } from './map/create-map';
import { addSeaLevelLayer } from './layers/sea-level';
import { createAttribution } from './ui/attribution';
import { setupControlPanel } from './ui/control-panel';

const defaultSource = elevationSources[0];

const map = createMap();
const attribution = createAttribution(map, DEFAULT_LINKS);
attribution.set(defaultSource.attribution);

map.on('load', () => {
  addSeaLevelLayer(map, defaultSource.url);
  applySky(map);
  setupControlPanel(map, attribution);
});
