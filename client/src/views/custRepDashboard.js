import { useState } from 'react';
import Questions from './custQuestions';
import ManageAuctions from './custManageAuctions';
import ManageBids from './custManageBids';
import ManageUsers from './custManageUsers';
import '../styles/custRepDashboard.css';

export default function CustomerRepDashboard() {
  const [activeView, setActiveView] = useState('questions');

  const handleLogout = () => {
    window.location.href = '/admin-login';
  };

  const menuItems = [
    {
      id: 'questions',
      label: 'Questions',
      description: 'Respond to user support questions'
    },
    {
      id: 'users',
      label: 'Manage Users',
      description: 'View, edit, and remove accounts'
    },
    {
      id: 'bids',
      label: 'Manage Bids',
      description: 'Review and remove invalid bids'
    },
    {
      id: 'auctions',
      label: 'Manage Auctions',
      description: 'Inspect and remove auction listings'
    }
  ];

  const renderView = () => {
    switch (activeView) {
      case 'questions':
        return <Questions />;
      case 'users':
        return <ManageUsers />;
      case 'bids':
        return <ManageBids />;
      case 'auctions':
        return <ManageAuctions />;
      default:
        return <Questions />;
    }
  };

  const activeItem = menuItems.find((item) => item.id === activeView);

  return (
    <div className="rep-dashboard-container">
      <header className="rep-header">
        <div className="rep-header-title">
          <div className="rep-brand-mark">JB</div>
          <div>
            <span className="ikea-logo">Bidme</span>
            <span className="dashboard-title">Customer Rep Dashboard</span>
          </div>
        </div>

        <button onClick={handleLogout} className="ikea-logout-btn">
          Logout
        </button>
      </header>

      <div className="rep-body">
        <aside className="rep-sidebar">
          <div className="rep-sidebar-label">Support Tools</div>

          <ul>
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={activeView === item.id ? 'active' : ''}
                onClick={() => setActiveView(item.id)}
              >
                <span className="rep-sidebar-title">{item.label}</span>
                <span className="rep-sidebar-desc">{item.description}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="rep-main">
          <div className="rep-page-heading">
            <h1>{activeItem?.label}</h1>
            <p>{activeItem?.description}</p>
          </div>

          <section className="rep-content-card">
            {renderView()}
          </section>
        </main>
      </div>
    </div>
  );
}