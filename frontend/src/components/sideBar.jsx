import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';

const Sidebar = ({ onReportedReports, onInprogressReports, onResolvedReports, onAnalytics, onLiveDetection }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth0();

  const navItems = [
    {
      title: 'Reported Reports',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377Z" />
        </svg>
      ),
      onClick: onReportedReports, 
    },
    {
      title: 'Repairs Progress',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 18" fill="currentColor">
          <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
        </svg>
      ),
      onClick: onInprogressReports, 
    },
    {
      title: 'Completed Reports',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377Z" />
        </svg>
      ),
      onClick: onResolvedReports, 
    },
    {
      title: 'Analytics',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 18 20" fill="currentColor">
          <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923Z" />
        </svg>
      ),
      onClick: onAnalytics, 
    },
    {
      title: 'Live Detection',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3.5C3 3.224 3.224 3 3.5 3h1c.276 0 .5.224.5.5v17c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-17Zm16.5-.5h1c.276 0 .5.224.5.5v17c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-17c0-.276.224-.5.5-.5Zm-12 .5a.5.5 0 0 1 .418-.494l7-1a.5.5 0 0 1 .582.494v17a.5.5 0 0 1-.418.494l-7 1a.5.5 0 0 1-.582-.494v-17Zm8 0a.5.5 0 0 1 .582-.494l7 1a.5.5 0 0 1 .418.494v17a.5.5 0 0 1-.582.494l-7-1a.5.5 0 0 1-.418-.494v-17Z" />
        </svg>
      ),
      onClick: onLiveDetection, 
    },
  ];
  

  return (
    <div>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-800 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
        </svg>
      </button>

      <aside
        className={`top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto ">
          <h1 className="text-xl font-bold text-gray-500 mb-6 px-2">Dashboard</h1>
          <div className="flex flex-col h-full">
            <ul className="space-y-2 font-medium mb-8">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center p-2 text-gray-600 text-sm hover:text-blue-800 group"
                    onClick={item.onClick} 
                  >
                    <span className="text-gray-600 group-hover:text-blue-800">
                      {item.icon}
                    </span>
                    <span className="ms-3 flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full bg-gray-100 text-gray-800 -300">
                        {item.badge}
                      </span>
                    )}
                  </a>

                </li>
              ))}
            </ul>

            <div className=" border-t border-gray-200 dark:border-gray-700 mb-3">
              <a
                href="#"
                className="flex items-center p-2 text-gray-600 text-sm  hover:text-blue-800 group font-semibold"
              >
                <span className="text-gray-600 group-hover:text-blue-800">
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" />
                    <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" />
                  </svg>
                </span>
                <span className="ms-3 flex-1" ><button onClick={() => logout({ logoutParams: { returnTo: 'http://localhost:5173/' } })}>Logout</button></span>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;