import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { sidebarRoutes } from '../data/sidebar';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const { url } = usePage();
  const isActive = (path) => {
    return window.location.pathname === path || window.location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 text-white bg-slate-900 rounded-md"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`h-screen bg-slate-900 text-white w-64 flex flex-col fixed left-0 top-0 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:w-64 z-40`}
      >
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1">
            {sidebarRoutes.map((route) => (
              <li key={route.id}>
                {route.subMenu ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(route.id)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-left hover:bg-slate-800 transition-colors ${
                        isActive(route.path) ? 'bg-slate-800 text-blue-400' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {route.icon}
                        <span>{route.title}</span>
                      </div>
                      {openMenus[route.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {openMenus[route.id] && (
                      <ul className="pl-10 mt-1 space-y-1 bg-slate-800/50">
                        {route.subMenu.map((subItem) => (
                          <li key={subItem.id}>
                            <Link
                              href={subItem.path}
                              className={`block px-4 py-2 hover:bg-slate-800 transition-colors ${
                                isActive(subItem.path) ? 'text-blue-400' : 'text-slate-300'
                              }`}
                              onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={route.path}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors ${
                      isActive(route.path) ? 'bg-slate-800 text-blue-400' : 'text-slate-300'
                    }`}
                    onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
                  >
                    {route.icon}
                    <span>{route.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay for Mobile when Sidebar is Open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;