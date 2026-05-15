from pathlib import Path

D = "div"
path = Path(__file__).resolve().parents[1] / "client/src/pages/Login.jsx"
path.write_text(
    f"""import {{ useState }} from 'react';
import {{ useNavigate, Link }} from 'react-router-dom';
import {{
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
}} from 'firebase/auth';
import {{ auth, hasConfig }} from '../firebase';
import {{ registerUser }} from '../api/client';
import '../styles/Login.css';

export default function Login() {{
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {{
    e.preventDefault();
    setLoading(true);
    setError('');

    try {{
      let uid;

      if (hasConfig && auth) {{
        const credential = isSignUp
          ? await createUserWithEmailAndPassword(auth, email, password)
          : await signInWithEmailAndPassword(auth, email, password);
        uid = credential.user.uid;
      }} else {{
        if (!mobile) throw new Error('Mobile number is required without Firebase config');
        uid = `user_${{mobile}}`;
      }}

      await registerUser({{ uid, mobile, name: name || 'Citizen', email }});
      localStorage.setItem('userId', uid);
      localStorage.setItem('userName', name || 'Citizen');
      navigate('/dashboard');
    }} catch (err) {{
      setError(err.response?.data?.error || err.message);
    }} finally {{
      setLoading(false);
    }}
  }};

  return (
    <{D} className="page login-page">
      <h1>Welcome</h1>
      <p className="subtitle">{{hasConfig ? 'Firebase sign in' : 'Quick sign in'}}</p>

      <form onSubmit={{handleSubmit}} className="login-form card">
        <label>
          Name
          <input value={{name}} onChange={{(e) => setName(e.target.value)}} placeholder="Your name" />
        </label>
        {{hasConfig && (
          <>
            <label>
              Email
              <input type="email" value={{email}} onChange={{(e) => setEmail(e.target.value)}} required />
            </label>
            <label>
              Password
              <input type="password" value={{password}} onChange={{(e) => setPassword(e.target.value)}} required minLength={{6}} />
            </label>
          </>
        )}}
        <label>
          Mobile
          <input value={{mobile}} onChange={{(e) => setMobile(e.target.value)}} placeholder="10-digit mobile" required />
        </label>
        {{error && <{D} className="error">{{error}}</{D}>}}
        <button type="submit" disabled={{loading}}>
          {{loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}}
        </button>
        {{hasConfig && (
          <button type="button" className="secondary" onClick={{() => setIsSignUp(!isSignUp)}}>
            {{isSignUp ? 'Already have an account? Sign In' : 'New user? Sign Up'}}
          </button>
        )}}
      </form>

      <Link to="/admin" className="admin-link">Admin login</Link>
    </{D}>
  );
}}
""",
    encoding="utf-8",
)
print("Wrote", path)
