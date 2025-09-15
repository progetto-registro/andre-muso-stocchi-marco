import './LandingPage.css';
import AuthCard from './AuthCard';
import { useEffect } from 'react';

export default function LandingPage() {
  useEffect(() => {
    document.title = "Benvenuto | La nostra App";
  }, []);

  return (
    <div className="landing-container">
      <AuthCard />
    </div>
  );
}
