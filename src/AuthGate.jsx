
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import {
  Bookmark,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2
} from "lucide-react";
import App from "./App";

export default function AuthGate() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) setError(error.message);
      setSession(data?.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });

        if (error) throw error;

        if (data.session) {
          setMessage("Account created successfully.");
        } else {
          setMessage(
            "Account created. Please check your email to confirm your account before logging in."
          );
          setMode("login");
          setPassword("");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F3] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#526B57]" size={25} />
      </div>
    );
  }

if (session) {
  return <App key={session.user.id} user={session.user} />;
}

  return (
    <main className="min-h-screen bg-[#F7F7F3] flex flex-col">
      <header className="h-[76px] px-6 sm:px-12 flex items-center border-b border-[#EAEAE3] bg-[#FBFAF6]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#526B57] flex items-center justify-center text-white">
            <Bookmark size={17} />
          </div>
          <span className="text-[21px] font-semibold tracking-[-1.1px] text-[#292B27]">
            linkora<span className="text-[#718875]">.</span>
          </span>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[430px]">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-5 h-px bg-[#82977E]" />
              <p className="text-[10px] uppercase tracking-[2px] text-[#85877D] font-medium">
                Your personal digital library
              </p>
            </div>

            <h1 className="text-[34px] sm:text-[39px] font-semibold tracking-[-1.7px] text-[#292B27] leading-tight">
              {mode === "login"
                ? "Good to have you back."
                : "Make room for good finds."}
            </h1>

            <p className="text-[13px] text-[#85877D] mt-3 leading-relaxed">
              {mode === "login"
                ? "Sign in to return to everything worth keeping."
                : "Create an account and start building your own corner of the internet."}
            </p>
          </div>

          <div className="bg-[#FBFAF6] border border-[#E7E7DF] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-1 p-1 bg-[#F0EFE9] rounded-lg mb-7">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                }}
                className={`flex-1 py-2.5 rounded-md text-[12px] font-medium transition-colors ${
                  mode === "login"
                    ? "bg-white text-[#435B47] shadow-sm"
                    : "text-[#85877D] hover:text-[#292B27]"
                }`}
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setMessage("");
                }}
                className={`flex-1 py-2.5 rounded-md text-[12px] font-medium transition-colors ${
                  mode === "register"
                    ? "bg-white text-[#435B47] shadow-sm"
                    : "text-[#85877D] hover:text-[#292B27]"
                }`}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="block text-[11px] font-medium text-[#686A61] mb-2">
                  Email address
                </span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-12 px-4 bg-white border border-[#E3E3DB] rounded-lg text-[13px] outline-none focus:border-[#82977E] transition-colors"
                />
              </label>

              <label className="block">
                <span className="block text-[11px] font-medium text-[#686A61] mb-2">
                  Password
                </span>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-12 px-4 pr-12 bg-white border border-[#E3E3DB] rounded-lg text-[13px] outline-none focus:border-[#82977E] transition-colors"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#92948A] hover:text-[#526B57]"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>

              {error && (
                <p role="alert" className="text-[11px] text-[#A75B51] leading-relaxed">
                  {error}
                </p>
              )}

              {message && (
                <div className="flex gap-2 items-start text-[11px] text-[#526B57] leading-relaxed">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                  <p>{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 flex items-center justify-center gap-2 bg-[#526B57] hover:bg-[#435B47] disabled:opacity-60 text-white rounded-lg text-[12px] font-medium transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Sign in to Linkora" : "Create your account"}
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-[10px] text-[#A0A196] mt-7 leading-relaxed">
            A quieter place for the things you find online.
          </p>
        </div>
      </section>

      <footer className="px-6 py-5 text-center border-t border-[#EAEAE3]">
        <p className="text-[10px] text-[#A0A196]">
          LINKORA © 2026 · MADE FOR THE CURIOUS
        </p>
      </footer>
    </main>
  );
}