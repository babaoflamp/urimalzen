import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon = '📊',
  color = 'rgba(16, 185, 129, 0.4)',
  subtitle,
}) => {
  return (
    <div style={{ ...styles.card, background: color }}>
      <div style={styles.icon}>{icon}</div>
      <div style={styles.content}>
        <div style={styles.title}>{title}</div>
        <div style={styles.value}>{value}</div>
        {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  icon: {
    fontSize: '40px',
    minWidth: '50px',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  value: {
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
    lineHeight: 1,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '12px',
    marginTop: '4px',
  },
};

export default StatCard;
