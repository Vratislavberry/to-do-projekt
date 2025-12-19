import { useContext } from "react";
import { listDetailContext } from "./listDetailProvider";


import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

function ItemCounter() {
  const { data } = useContext(listDetailContext);
  const pie_data = [
    {
      name: "✔",
      value: data?.itemList?.reduce(
        (accum, item) => (item.state === "checked" ? accum + 1 : accum),
        0
      ),
    },
    {
      name: "X",
      value: data?.itemList?.reduce(
        (accum, item) => (item.state === "unchecked" ? accum + 1 : accum),
        0
      ),
    },
  ];

  return (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pie_data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label={({ payload }) => payload.name}
              labelLine={false}
            >
              {pie_data.map((_, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={idx === 0 ? "#16d342ff" : "#ff0000ff"}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
  );
}

export default ItemCounter;
