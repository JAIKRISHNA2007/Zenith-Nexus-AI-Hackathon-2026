import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    const success = await register({ name, email, password });
    if (success) {
      navigate("/dashboard");
    }
  };

  const displayError = validationError || error;

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {displayError && (
        <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
          {displayError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
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

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <Button className="w-full h-11" type="submit" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?
        <Link
          to="/login"
          className="ml-1 font-semibold text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;