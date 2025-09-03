import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignIn(){
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try{ await login(email, password); nav("/"); }catch(e:any){ setError(e.message||"Failed"); } finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="py-10">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border rounded-2xl p-6 shadow">
          <h1 className="text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-sm text-gray-600 mb-4">Welcome back</p>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="text-sm">Email</label>
              <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm">Password</label>
              <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading? "Signing in...":"Sign in"}</Button>
          </form>
          <p className="text-sm text-gray-600 mt-3">No account? <Link to="/signup" className="text-brand-700">Create one</Link></p>
        </div>
      </div>
    </Layout>
  );
}
