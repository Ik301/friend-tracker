import { useState } from 'react';
import { setUserId } from '../utils/localStorage';

const Login = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (code.length !== 3) {
      setError('Code must be 3 digits');
      return;
    }

    if (!/^\d{3}$/.test(code)) {
      setError('Code must contain only numbers');
      return;
    }

    setUserId(code);
    onLogin(code);
  };

  return (
    <div className="min-h-screen bg-[#2d1810] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#edc4b3] mb-2">Friend Contact Tracker</h1>
          <p className="text-[#b07d62]">Enter your 3-digit code to access your contacts</p>
        </div>

        <div className="bg-[#3d241a] border border-[#774936] rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#c38e70] mb-2">
                Your Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                maxLength={3}
                placeholder="000"
                className="w-full px-4 py-3 bg-[#2d1810] border border-[#774936] text-[#edc4b3] text-center text-2xl tracking-widest rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#c38e70] hover:bg-[#b07d62] text-[#2d1810] px-6 py-3 rounded-lg transition-all font-medium"
            >
              Access My Contacts
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#774936]">
            <p className="text-sm text-[#b07d62] text-center">
              Don't have a code? Just pick any 3-digit number (000-999) and it will be created for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
