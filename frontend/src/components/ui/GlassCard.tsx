interface Props {
  children: React.ReactNode;
}

export default function GlassCard({ children }: Props) {
  return (
    <div className="glass-card">
      {children}
    </div>
  );
}