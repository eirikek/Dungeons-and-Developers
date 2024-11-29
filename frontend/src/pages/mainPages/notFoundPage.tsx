import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-customGray text-white">
      <h1 className="header font-bold mb-4">404</h1>
      <p className="text mb-6">Oops! The page you're looking for doesn't exist.</p>
      <div className="flex space-x-4">
        <button
          onClick={handleGoBack}
          className="bg-customRed hover:bg-transparent border-customRed hover:border-customRed hover:text-customRed text px-1 rounded-md border-2 transition-colors duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
