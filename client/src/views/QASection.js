import React, { useEffect, useState } from 'react';
import { Search, Send, Bell, MessageCircle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custRepDashboard.css';
import Layout from './layout';

function CustFaq() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch('/api/faq')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setQuestions(data.faqs);
        }
      });
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/notifications?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setNotificationCount(data.length);
      })
      .catch((err) => console.error('Failed to fetch notifications', err));
  }, [userId]);

  const handleClearNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      if (res.ok) {
        setNotifications([]);
        setNotificationCount(0);
        setShowNotifications(false);
      }
    } catch (err) {
      console.error('Clear error:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    fetch('/api/faq/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: newQuestion,
        user_id: parseInt(userId)
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setQuestions([{ question: newQuestion, answer: null }, ...questions]);
          setNewQuestion('');
        }
      });
  };

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout
      notificationCount={notificationCount}
      onAlertClick={() => setShowNotifications(true)}
    >
      <div className="faq-page">
        <div className="faq-header">
          <div>
            <h2>Help & Q&A</h2>
            <p>Browse common questions or ask for help from support.</p>
          </div>

          <div className="question-count-card">
            <MessageCircle size={20} />
            <div>
              <span>Total Questions</span>
              <strong>{questions.length}</strong>
            </div>
          </div>
        </div>

        <div className="faq-action-card">
          <div className="manage-search bid-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <form onSubmit={handleSubmit} className="faq-ask-form">
            <input
              type="text"
              placeholder="Ask your question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <button type="submit">
              <Send size={16} />
              Submit
            </button>
          </form>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="empty-support-card">
            <MessageCircle size={34} />
            <h3>No matching questions</h3>
            <p>Try searching something else or ask a new question.</p>
          </div>
        ) : (
          <div className="questions-list">
            {filteredQuestions.map((q, idx) => (
              <div key={idx} className="modern-question-card">
                <div className="question-top-row">
                  <div className="question-avatar">Q</div>

                  <div>
                    <h3>{q.question}</h3>
                    <p className="faq-answer">
                      <strong>A:</strong> {q.answer || '⏳ Awaiting response'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showNotifications && (
        <div className="notification-overlay">
          <div className="notification-card-modern">
            <div className="notification-header-modern">
              <h3><Bell size={18} /> Notifications</h3>
              <button onClick={() => setShowNotifications(false)}>×</button>
            </div>

            <div className="notification-list-modern">
              {notifications.length > 0 ? (
                notifications.map((note, idx) => (
                  <div key={idx} className="notification-item-modern">
                    <p>{note.message}</p>
                    <small>{note.created_at}</small>
                  </div>
                ))
              ) : (
                <p>No notifications available.</p>
              )}
            </div>

            <button
              onClick={handleClearNotifications}
              className="modern-submit-btn"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default CustFaq;