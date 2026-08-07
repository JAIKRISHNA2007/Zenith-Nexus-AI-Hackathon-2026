import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const success = await login({ email, password });
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="email">Email Address</Label>

        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>

        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-blue-600 hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;