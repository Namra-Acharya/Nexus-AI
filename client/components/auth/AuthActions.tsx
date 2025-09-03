import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export function AuthActions(){
  const { user, logout } = useAuth();
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/login">Sign in</Link>
        </Button>
        <Button variant="brand" size="sm" asChild>
          <Link to="/signup">Create account</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-gray-700">Hi, {user.name || user.email}</div>
      <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
    </div>
  );
}
