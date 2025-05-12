import { useNavigate } from 'react-router-dom';
import './HomePages.css'; 

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Bienvenido a OX GYM</h1>
        <button
          onClick={() => navigate('/login')}
          className="home-button"
        >
          EMPEZAR
        </button>
      </div>
    </div>
  );
}

export default HomePage;