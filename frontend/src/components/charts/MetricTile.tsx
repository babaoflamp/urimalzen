import React from 'react';

interface MetricTileProps {
  label: string;
  value: string | number;
  color?: string;
}

const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  color = 'rgba(129, 199, 132, 0.3)',
}) => {
  return (
    <div style={{ ...styles.tile, background: color }}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  tile: {
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  value: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
  },
};

export default MetricTile;
