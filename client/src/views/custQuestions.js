import React, { useEffect, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import '../styles/custRepDashboard.css';

export default function Questions() {
  const [unanswered, setUnanswered] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetch('/api/faq/unanswered')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setUnanswered(data.faqs);
        }
      });
  }, []);

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = (id) => {
    const answer = answers[id];

    if (!answer || !answer.trim()) return;

    fetch(`/api/faq/answer/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setUnanswered((prev) => prev.filter((q) => q.id !== id));

          const updatedAnswers = { ...answers };
          delete updatedAnswers[id];
          setAnswers(updatedAnswers);
        }
      });
  };

  return (
    <div className="questions-page">
      <div className="questions-header">
        <div>
          <h2>Pending Questions</h2>
          <p>Review unanswered customer questions and submit official responses.</p>
        </div>

        <div className="question-count-card">
          <MessageCircle size={20} />
          <div>
            <span>Pending</span>
            <strong>{unanswered.length}</strong>
          </div>
        </div>
      </div>

      {unanswered.length === 0 ? (
        <div className="empty-support-card">
          <MessageCircle size={34} />
          <h3>All caught up</h3>
          <p>There are no unanswered customer questions right now.</p>
        </div>
      ) : (
        <div className="questions-list">
          {unanswered.map((q) => (
            <div key={q.id} className="modern-question-card">
              <div className="question-top-row">
                <div className="question-avatar">
                  {q.username?.charAt(0)?.toUpperCase() || '?'}
                </div>

                <div>
                  <p className="question-author">Asked by {q.username || 'Unknown User'}</p>
                  <h3>{q.question}</h3>
                </div>
              </div>

              <div className="answer-area">
                <label>Your Answer</label>
                <textarea
                  placeholder="Type a clear response for the customer..."
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              </div>

              <div className="question-card-footer">
                <span className="answer-hint">
                  Response will be visible in the FAQ section.
                </span>

                <button
                  className="modern-submit-btn"
                  onClick={() => handleSubmit(q.id)}
                  disabled={!answers[q.id]?.trim()}
                >
                  <Send size={16} />
                  Submit Answer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}