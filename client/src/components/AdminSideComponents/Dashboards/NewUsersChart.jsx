import React from 'react';
import Chart from 'react-apexcharts';

const NewUsersChart = () => {
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
      type: 'bar',
      height: '100%',
      toolbar: {
        show: true,
        tools: {
          download: '<svg>...</svg>',
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: '<svg>...</svg>'
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      },
      foreColor: '#6B7280', // gray-500
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#6366F1'], // Indigo-500
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '55%',
        distributed: false,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent']
    },
    series: [{
      name: 'New Users',
      data: [85, 120, 95, 150, 180, 210]
    }],
    xaxis: {
      categories: getLastSixMonths(),
      labels: {
        style: {
          colors: '#6B7280', // gray-500
          fontSize: '12px',
          fontWeight: 400,
          cssClass: 'apexcharts-xaxis-label'
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
          colors: '#6B7280', // gray-500
          fontSize: '12px',
          fontWeight: 400
        },
        formatter: (value) => { return Math.floor(value) === value ? value : ''; }
      },
      min: 0,
      tickAmount: 5
    },
    grid: {
      borderColor: '#E5E7EB', // gray-200
      strokeDashArray: 4,
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
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      y: {
        formatter: (value) => `${value} new users`,
        title: {
          formatter: () => 'Users'
        }
      },
      marker: {
        show: true
      },
      theme: 'light',
      fillSeriesColor: false
    },
    fill: {
      opacity: 1,
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: ['#8B5CF6'], // purple-500
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 100]
      }
    }
  };

  return (
    <div className="bg-white p-5 mt-6 rounded-xl border border-gray-100 shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">User Acquisition</h2>
          <p className="text-xs text-gray-500">Last 6 months</p>
        </div>
        <div className="flex space-x-2">
          {/* <button className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button> */}
          <select className="text-xs border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700">
            <option>6 Months</option>
            <option>12 Months</option>
            <option>Custom</option>
          </select>
        </div>
      </div>
      <div className="h-64 w-full">
        <Chart
          options={options}
          series={options.series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
      <div className="mt-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
          <span className="text-xs text-gray-600">Monthly Signups</span>
        </div>
        <span className="text-xs text-gray-500">
          Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

export default NewUsersChart;