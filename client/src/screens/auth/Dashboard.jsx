import React from "react";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const chartOptions = {
    chart: {
      type: "area",
      height: "100%",
      width: "100%",
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 400,
          },
        },
      },
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      title: {
        text: "Months",
      },
    },
    yaxis: {
      title: {
        text: "Expenses",
      },
    },
  };

  const chartSeries = [
    {
      name: "Monthly Expenses",
      data: [450, 380, 600, 700, 400, 900, 750, 650, 800, 700, 500, 450],
    },
  ];

  return (
    <div className="dashboardContainer p-6">
      <h1 className="text-primaryTextColor text-[25px] sm:text-[32px] font-bold mb-6">Dashboard</h1>
      <div className="chart sm:h-[30rem] h-[26rem] bg-white mt-10 rounded-lg p-3 sm:p-6 ">
        <div className="flex justify-between items-center">
          <h1 className="text-[18px] text-primaryTextColor sm:text-[24px] font-bold">
            Monthly Expenses Details
          </h1>
          <select name="" id="" className="p-2 border-2 rounded-md">
            <option value="">Current Month</option>
            <option value="">January</option>
            <option value="">February</option>
            <option value="">March</option>
            <option value="">April</option>
            <option value="">May</option>
            <option value="">June</option>
            <option value="">July</option>
            <option value="">August</option>
            <option value="">September</option>
            <option value="">October</option>
            <option value="">November</option>
            <option value="">December</option>
          </select>
        </div>

        <Chart
          options={chartOptions}
          series={chartSeries}
          type="area"
          height="100%"
        />
      </div>
    </div>
  );
};

export default Dashboard;
