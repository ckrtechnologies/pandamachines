import React, { useEffect, useRef } from 'react';
import Chart from 'react-apexcharts';

const OrdersChart = () => {
  const chartRef = useRef(null);

  // Generate last 6 months data
  const getLastSixMonths = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleString('default', { month: 'short' }));
    }
    return months;
  };

  // Chart configuration
  const options = {
    chart: {
      type: 'area',
      height: '100%',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      zoom: {
        enabled: true
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#3B82F6'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    series: [{
      name: 'Orders',
      data: [125, 190, 210, 280, 240, 320] // Replace with your actual data
    }],
    xaxis: {
      categories: getLastSixMonths(),
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        },
        formatter: (value) => { return Math.floor(value) === value ? value : ''; }
      },
      min: 0
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true
        }
      },
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '12px'
      },
      x: {
        show: true,
        formatter: (value) => `Month: ${value}`
      },
      y: {
        formatter: (value) => `${value} orders`
      },
      marker: {
        show: true
      },
      fixed: {
        enabled: false,
        position: 'topRight'
      }
    },
    markers: {
      size: 5,
      colors: ['#3B82F6'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7
      }
    }
  };

  return (
    <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Order Trends (Last 6 Months)</h2>
        <div className="flex space-x-2">
          {/* <button className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100">
            Export
          </button> */}
          <select className="text-xs border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>6 Months</option>
            <option>12 Months</option>
            <option>Custom</option>
          </select>
        </div>
      </div>
      <div className="h-64 w-full">
        <Chart
          ref={chartRef}
          options={options}
          series={options.series}
          type="area"
          height="100%"
          width="100%"
        />
      </div>
      <div className="mt-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600">Total Orders</span>
        </div>
        <span className="text-xs text-gray-500">
          Updated: {new Date().toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default OrdersChart;