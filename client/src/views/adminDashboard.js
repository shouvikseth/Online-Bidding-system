import { useState } from 'react';
import CreateCustomerRep from './createCustRep';
import SalesReport from './salesReport';
import ResetRequests from './resetRequests';
import '../styles/adminDashboard.css';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('create');

  const handleLogout = () => {
    window.location.href = '/admin-login';
  };

  const menuItems = [
    {
      id: 'create',
      label: 'Create Customer Rep',
      description: 'Add new support staff'
    },
    {
      id: 'sales',
      label: 'Sales Report',
      description: 'View earnings and analytics'
    },
    {
      id: 'reset',
      label: 'Reset Requests',
      description: 'Manage password requests'
    }
  ];

  const renderPanel = () => {
    switch (activeSection) {
      case 'sales':
        return <SalesReport />;
      case 'reset':
        return <ResetRequests />;
      case 'create':
      default:
        return <CreateCustomerRep />;
    }
  };

  const activeItem = menuItems.find((item) => item.id === activeSection);

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <div className="admin-header-title">
          <div className="brand-mark">JB</div>
          <div>
            <span className="ikea-logo">Bidme</span>
            <span className="dashboard-title">Admin Dashboard</span>
          </div>
        </div>

        <button onClick={handleLogout} className="ikea-logout-btn">
          Logout
        </button>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <div className="sidebar-label">Management</div>

          <ul>
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="sidebar-item-title">{item.label}</span>
                <span className="sidebar-item-desc">{item.description}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="admin-main">
          <div className="admin-page-heading">
            <h1>{activeItem?.label}</h1>
            <p>{activeItem?.description}</p>
          </div>

          <section className="admin-card">
            {renderPanel()}
          </section>
        </main>
      </div>
    </div>
  );
}