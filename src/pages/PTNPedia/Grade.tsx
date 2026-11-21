import PTNPediaView from '../PTNPediaView';
import { useNavigate } from 'react-router-dom';

export default function PTNPediaGrade() {
  const navigate = useNavigate();
  return <PTNPediaView onBack={() => navigate('/ptnpedia')} />;
}
