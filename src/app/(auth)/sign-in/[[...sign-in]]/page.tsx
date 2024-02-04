import { SignIn } from "@clerk/nextjs";

export default function signInPage() {
  return (
    <div className="signin-page">
      <SignIn />
    </div>
  );
}
