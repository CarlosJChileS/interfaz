import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function FeedbackPage() {
  const { t } = useTranslation();
  const [msg, setMsg] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t('modal_feedback_thanks'));
    setMsg('');
  };
  return (
    <div style={{ padding: '20px' }}>
      <h2>{t('feedback_page_title')}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          style={{ width: '100%', height: '100px' }}
          placeholder={t('modal_feedback_placeholder')}
        />
        <br />
        <button type="submit">{t('modal_send')}</button>
      </form>
    </div>
  );
}
