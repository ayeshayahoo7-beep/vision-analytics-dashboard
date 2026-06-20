import KPICards from "../components/KPICards";
import { stats } from "../data/mockData";

export default function Dashboard() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Vision Analytics Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <KPICards
          title="Total Detections"
          value={stats.totalDetections}
        />

        <KPICards
          title="Average Confidence"
          value={`${stats.averageConfidence}%`}
        />

        <KPICards
          title="Today's Activity"
          value={stats.todayDetections}
        />
      </div>
    </div>
  );
}