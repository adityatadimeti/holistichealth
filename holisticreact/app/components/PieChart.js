import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart({ chartData, calcount = 0, desc, summary }) {
  return (
    <div className="chart-container">
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Total calories " + calcount,
            },
          },
        }}
      />
      <h2 style={{ marginTop: "10px" }}>{desc}</h2>
      <h6 style={{ fontSize: "12px" }}>{summary}</h6>
    </div>
  );
}
export default PieChart;
