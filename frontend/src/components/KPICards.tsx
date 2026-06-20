type Props = {
  title: string;
  value: string | number;
};

export default function KPICards({ title, value }: Props) {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "12px",
      }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}