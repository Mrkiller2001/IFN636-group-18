import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import StatusBar from '../components/Layout/StatusBar';
import GreenButton from '../components/UI/GreenButton';
import FormInput from '../components/UI/FormInput';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  // Email icon
  const EmailIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );

  // Lock icon
  const LockIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  return (
    <div className="bg-white relative min-h-screen max-w-[393px] mx-auto" data-name="Login">
      {/* Status Bar */}
      <StatusBar />
      
      {/* Background Color */}
      <div className="absolute bg-[#8bc193] h-[809px] left-0 top-[44px] right-0" />
      
      {/* Decorative Image */}
      <div className="absolute h-[180px] left-0 top-[82px] right-0 bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
        <div className="text-6xl">🗂️</div>
      </div>
      
      {/* Decorative Circle */}
      <div className="absolute left-[-49px] w-[497px] h-[497px] top-[50px] bg-gradient-to-br from-green-100/30 to-green-200/30 rounded-full" />
      
      {/* Login Title */}
      <h1 className="absolute font-['Karla'] font-semibold text-[40px] text-white left-[140px] top-[271px]">
        LOGIN
      </h1>
      
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="absolute left-[95px] right-[94px] top-[339px] space-y-4">
        <FormInput
          type="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={<EmailIcon />}
        />
        
        <FormInput
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          icon={<LockIcon />}
        />
        
        <div className="pt-4">
          <GreenButton 
            type="submit" 
            variant="secondary"
            className="w-full"
          >
            Login
          </GreenButton>
        </div>
      </form>
      
      {/* Forgot Password Link */}
      <p className="absolute font-['Karla'] font-medium text-[11px] text-[rgba(0,0,0,0.26)] left-[149px] top-[469px]">
        <Link to="/forgot-password" className="hover:underline">
          Forgot Password?
        </Link>
      </p>
    </div>
  );
};

export default Login;
