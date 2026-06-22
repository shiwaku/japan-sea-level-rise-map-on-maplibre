import maplibregl from 'maplibre-gl';

/** 出典表記を差し替え可能な形で管理するコントローラ。 */
export interface AttributionController {
  /** 既定リンクに続けて `extra`（HTML）を表示する。 */
  set(extra: string): void;
}

/**
 * AttributionControl の生成・差し替えをまとめて扱うコントローラを返す。
 * 標高ソースの切り替えに合わせて出典表記を更新するために使う。
 */
export function createAttribution(
  map: maplibregl.Map,
  defaultLinks: string,
): AttributionController {
  let control: maplibregl.AttributionControl | undefined;

  return {
    set(extra: string): void {
      if (control) {
        map.removeControl(control);
      }
      control = new maplibregl.AttributionControl({
        compact: true,
        customAttribution: `${defaultLinks} ${extra}`,
      });
      map.addControl(control, 'bottom-right');
    },
  };
}
