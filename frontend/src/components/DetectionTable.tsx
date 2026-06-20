export default function DetectionTable({
  data,
}: any) {
  return (
    <table className="w-full">

      <thead>

        <tr className="text-left border-b border-slate-700">

          <th>ID</th>
          <th>Object</th>
          <th>Confidence</th>
          <th>Time</th>

        </tr>

      </thead>

      <tbody>

        {data.map((item: any) => (
          <tr
            key={item.id}
            className="border-b border-slate-800"
          >
            <td>{item.id}</td>
            <td>{item.object}</td>
            <td>{item.confidence}</td>
            <td>{item.time}</td>
          </tr>
        ))}

      </tbody>

    </table>
  );
}