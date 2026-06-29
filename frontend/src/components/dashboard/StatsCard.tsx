import CountUp from "react-countup";
import GlassCard from "../ui/GlassCard";

interface Props {
  title: string;
  value: number;
  icon: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: Props) {
  return (
    <GlassCard>
      <div className="stats-card-content">
        <div className="stats-info">
          <h4>{title}</h4>
          <h1>
            <CountUp 
              end={value} 
              duration={1.2} 
              separator="," 
              decimals={title === "FPS" || title === "Confidence" ? 1 : 0} 
              suffix={title === "Confidence" ? "%" : ""}
            />
          </h1>
        </div>
        <div className="stats-icon-wrapper">
          {icon}
        </div>
      </div>
      <div className="stats-card-footer">
        <span className="stats-pulse" />
        <span>TELEMETRY</span>
      </div>
    </GlassCard>
  );
}