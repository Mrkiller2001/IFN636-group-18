import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import StatusBar from '../components/Layout/StatusBar';
import GreenButton from '../components/UI/GreenButton';
import FormInput from '../components/UI/FormInput';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    agreeTerms: false 
  });
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    
    if (!formData.agreeTerms) {
      setErrorMsg('Please accept the terms and conditions');
      return;
    }

    try {
      await axiosInstance.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        'Registration failed. Please try again.';
      setErrorMsg(serverMsg);
    }
  };

  // Icons
  const UserIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const EmailIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );

  const LockIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  return (
    <div className="bg-white relative min-h-screen max-w-[393px] mx-auto" data-name="Create Account">
      {/* Status Bar */}
      <StatusBar />
      
      {/* Background */}
      <div className="absolute bg-[#8bc193] h-[809px] left-0 top-[44px] right-0" />
      
      {/* Decorative Image Area */}
      <div className="absolute h-[314px] left-0 top-[60px] right-0 bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
        <div className="text-8xl">♻️</div>
      </div>
      
      {/* Profile Circle */}
      <div className="absolute left-1 w-[396px] h-[396px] top-[48px] bg-gradient-to-br from-green-100/30 to-green-200/30 rounded-full flex items-end justify-center pb-8">
        {/* Create account title */}
        <h1 className="absolute font-['Karla'] font-semibold text-[20px] text-white bottom-[120px]">
          Create account
        </h1>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="absolute left-[97px] right-[96px] top-[389px] space-y-4">
        <FormInput
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          icon={<UserIcon />}
        />
        
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
        
        <FormInput
          type="password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          icon={<LockIcon />}
        />

        {/* Terms & Conditions */}
        <div className="flex items-center space-x-3 py-2">
          <div className="bg-neutral-100 w-3 h-3 rounded-sm shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="w-2 h-2 accent-[#55ac62]"
            />
          </div>
          <span className="font-['Kreon'] font-semibold text-[12px] text-[rgba(0,0,0,0.7)]">
            I agree terms & conditions
          </span>
        </div>
        
        <div className="pt-4">
          <GreenButton 
            type="submit" 
            variant="primary"
            className="w-full"
          >
            Sign up
          </GreenButton>
        </div>
        
        {/* Already have account link */}
        <div className="text-center pt-4">
          <Link 
            to="/login" 
            className="font-['Kreon'] font-semibold text-[12px] text-[rgba(0,0,0,0.7)] hover:underline"
          >
            Already have an account? Sign in Here
          </Link>
        </div>
      </form>

      {/* Error Message */}
      {errorMsg && (
        <div className="absolute left-4 right-4 top-[700px] bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
          {String(errorMsg)}
        </div>
      )}
    </div>
  );
};

export default Register;
