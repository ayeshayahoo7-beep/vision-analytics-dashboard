import { motion } from "framer-motion";
import CountUp from "react-countup";

interface Props {
  label: string;
  count: number;
  icon: string;
}

export default function DetectionCard({
  label,
  count,
  icon,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.02,
      }}
      className="detection-card"
    >
      <div className="detection-icon">{icon}</div>

      <h4>{label}</h4>

      <h2>
        <CountUp end={count} duration={0.8} />
      </h2>
    </motion.div>
  );
}