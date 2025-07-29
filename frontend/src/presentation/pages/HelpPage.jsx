import React from 'react';
import HelpCenter from '../components/HelpCenter';
import LanguageToggle from '../components/LanguageToggle';

export default function HelpPage() {
  return (
    <>
      <LanguageToggle className="lang-toggle-fixed" />
      <HelpCenter />
    </>
  );
}
