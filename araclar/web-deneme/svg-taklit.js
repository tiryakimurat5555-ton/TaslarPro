// react-native-svg'nin tarayıcı taklidi: gerçek <svg> çizer.
import React from 'react';
export default function Svg(p) {
  return (
    <svg width={p.width} height={p.height} viewBox={p.viewBox} style={{ display: 'block' }} aria-hidden="true">
      {p.children}
    </svg>
  );
}
export function Path(p) {
  return <path d={p.d} fill={p.fill} />;
}
export const Svgx = Svg;
