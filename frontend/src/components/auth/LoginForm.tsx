import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Link } from "react-router-dom";


const LoginForm = () => {
  return (
    <form className="space-y-5">
      <div>
        <Label htmlFor="email">Email Address</Label>

        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>

        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
        />
      </div>

      <Button className="w-full">
        Login
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