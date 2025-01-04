import React from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from 'recharts';

const barData = [
  { name: 'Lorem Ipsum', value: 1.7, percentage: 50, color: '#4a90e2' },
  { name: 'Consectetur', value: 1.3, percentage: 42, color: '#50a5f1' },
  { name: 'Dolor Sit Amet', value: 1.8, percentage: 61, color: '#5eb7ff' },
  { name: 'Adipiscing', value: 1.2, percentage: 26, color: '#6cc3ff' },
  { name: 'Magna Aliqua', value: 1.6, percentage: 48, color: '#81d0ff' },
];

const lineData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  series1: Math.random() * 20 + 20,
  series2: Math.random() * 15 + 15,
  series3: Math.random() * 10 + 5,
}));

const pieChartData = [
  { name: 'Completed', value: 60, color: '#4a90e2' },
  { name: 'Remaining', value: 40, color: '#dfe9f6' },
];

const progressData = [
  { label: 'A', value: 70, color: '#5eb7ff' },
  { label: 'B', value: 42, color: '#50a5f1' },
  { label: 'C', value: 84, color: '#4a90e2' },
  { label: 'D', value: 27, color: '#6cc3ff' },
  { label: 'E', value: 73, color: '#81d0ff' },
];

const timeData = [
    { label: 'Avg completino', value: 50, color: '#5eb7ff' },
    { label: 'Avg Starting', value: 42, color: '#50a5f1' },
  ];

// const timeData = [
//   { name: 'Project 1', start: 10, completion: 50 },
//   { name: 'Project 2', start: 12, completion: 40 },
//   { name: 'Project 3', start: 15, completion: 60 },
//   { name: 'Project 4', start: 8, completion: 30 },
// ];

const PieChartComponent = () => (
  <div className="h-60 w-60 mx-auto">
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={pieChartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="70%"
          paddingAngle={5}
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Bar Chart</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Pie Chart</h3>
          <PieChartComponent />
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Line Chart</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line type="monotone" dataKey="series1" stroke="#4a90e2" dot={{ fill: '#4a90e2' }} />
                <Line type="monotone" dataKey="series2" stroke="#50a5f1" dot={{ fill: '#50a5f1' }} />
                <Line type="monotone" dataKey="series3" stroke="#5eb7ff" dot={{ fill: '#5eb7ff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* Progress Bars */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Progress Bars</h3>
          <div className="space-y-4">
            {progressData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-gray-500">{item.value}%</span>
                </div>
                <div className="h-6 w-full bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Average Time Bar Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">Average time taken</h3>
        <div className="space-y-4">
            {timeData.map((item, index) => (
            <div key={index}>
                <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{item.label}</span>
                <span className="text-gray-500">{item.value}%</span>
                </div>
                {/* Line representing the progress */}
                <div className="h-1 w-full">
                <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                />
                </div>
            </div>
            ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
