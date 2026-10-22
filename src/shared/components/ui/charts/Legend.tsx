interface LegendProps {
  items: { label: string; color: string }[];
  direction?: 'horizontal' | 'vertical';
}

/** Legend WDS: titik warna + label per seri. */
function Legend({ items, direction = 'horizontal' }: LegendProps) {
  return (
    <ul data-direction={direction} className="wds-legend">
      {items.map((item) => (
        <li key={item.label} className="wds-legend__item">
          <span className="wds-legend__dot" style={{ backgroundColor: item.color }} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export default Legend;
