interface Props {
  title: string;
  value: number;
  icon: string;
}

export default function StatsCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <div className="glass-card">
      <div className="stats-icon">{icon}</div>

      <h4>{title}</h4>

      <h1>{value}</h1>

      <span>LIVE</span>
    </div>
  );
}