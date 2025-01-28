"use client";
import { FaNewspaper, FaGoogle, FaBell, FaSearch, FaShareAlt } from 'react-icons/fa';

const ConfigurationPage = () => {
  const modules = [
    {
      title: 'Newsletter',
      description: 'Configure email newsletter settings and templates',
      icon: FaNewspaper,
      status: 'Active'
    },
    {
      title: 'Google News',
      description: 'Manage Google News publication settings',
      icon: FaGoogle,
      status: 'Inactive'
    },
    {
      title: 'Push Notifications',
      description: 'Configure web push notification settings',
      icon: FaBell,
      status: 'Active'
    },
    {
      title: 'SEO',
      description: 'Search engine optimization settings',
      icon: FaSearch,
      status: 'Active'
    },
    {
      title: 'Social Media',
      description: 'Manage social media integration',
      icon: FaShareAlt,
      status: 'Active'
    }
  ];

  return (
    <div className="p-6 pt-24">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Manage system modules and integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                item.status === 'Active' 
                  ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                  : 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'
              }`}>
                {item.status}
              </span>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {item.description}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Configure Settings
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigurationPage;