import { SignUp } from "@clerk/nextjs";

export default function signUpPage() {
  return (
    <div className="signup-page">
      <SignUp />
    </div>
  );
}
