import maplibregl from 'maplibre-gl';
import { elevationSources } from '../config/elevation-sources';
import { setSeaLevel, setElevationTiles } from '../layers/sea-level';
import type { AttributionController } from './attribution';

const DISCLAIMER_TEXT =
  '本シミュレータは地形データで一定の高さ以下の場所を青く塗りつぶす処理をするだけのものであり、ハザードマップとは異なります。' +
  '堤防等による防災対策や土砂の堆積等は考慮されていません。実際の洪水や津波発生時の危険性は各自治体が公表するハザードマップでご確認ください。';

/** 必須の DOM 要素を取得する。見つからなければ例外を投げる。 */
function getElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`要素 #${id} が見つかりません`);
  }
  return el as T;
}

/**
 * オーバーレイ UI（海面高さスライダー・標高ソース選択・免責事項）を
 * 地図に接続する。`map.on('load')` 後に呼ぶ。
 */
export function setupControlPanel(
  map: maplibregl.Map,
  attribution: AttributionController,
): void {
  setupElevationSlider(map);
  setupSourceSelector(map, attribution);
  setupDisclaimer();
}

/** 海面高さスライダーを接続する。 */
function setupElevationSlider(map: maplibregl.Map): void {
  const slider = getElement<HTMLInputElement>('elevation-slider');
  const valueLabel = getElement('elevation-value');

  slider.addEventListener('input', () => {
    const height = Number(slider.value);
    valueLabel.textContent = `${height}m`;
    setSeaLevel(map, height);
  });
}

/** 標高ソースのセレクタを構築し、切り替え時にタイルと出典を更新する。 */
function setupSourceSelector(map: maplibregl.Map, attribution: AttributionController): void {
  const selector = getElement<HTMLSelectElement>('source-selector');

  for (const source of elevationSources) {
    const option = document.createElement('option');
    option.value = source.id;
    option.textContent = source.label;
    selector.appendChild(option);
  }

  selector.addEventListener('change', () => {
    const source = elevationSources.find((s) => s.id === selector.value);
    if (!source) {
      return;
    }
    attribution.set(source.attribution);
    setElevationTiles(map, source.url);
  });
}

/** 免責事項ボタンを接続する。 */
function setupDisclaimer(): void {
  const button = getElement<HTMLInputElement>('disclaimer-button');
  button.addEventListener('click', () => {
    alert(DISCLAIMER_TEXT);
  });
}
