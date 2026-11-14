import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "http://127.0.0.1:8000/api";

export function Login() {
    const navigate = useNavigate();
    const { language, dir } = useLanguage();

    const isAr = language === "ar";

    const text = {
        title: isAr ? "تسجيل دخول الإدارة" : "Admin Login",
        subtitle: isAr
            ? "سجّل الدخول لإدارة معرض أعمال صفاء."
            : "Sign in to manage Safaa's portfolio.",
        email: isAr ? "البريد الإلكتروني" : "Email",
        password: isAr ? "كلمة المرور" : "Password",
        signIn: isAr ? "تسجيل الدخول" : "Sign In",
        signingIn: isAr ? "جارٍ تسجيل الدخول..." : "Signing in...",
        invalidCredentials: isAr
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
            : "Invalid email or password.",
        connectionError: isAr
            ? "تعذر الاتصال بالخادم. حاول مرة أخرى."
            : "Unable to connect to the server.",
        loginError: isAr
            ? "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى."
            : "An error occurred while signing in. Please try again.",
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        localStorage.removeItem("admin_token");

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(text.invalidCredentials);
            }

            if (!data.token) {
                throw new Error(text.loginError);
            }

            localStorage.setItem("admin_token", data.token);

            navigate("/admin", { replace: true });
        } catch (err) {
            localStorage.removeItem("admin_token");

            setError(
                err instanceof Error
                    ? err.message
                    : text.connectionError
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            dir={dir}
            className="flex min-h-screen items-center justify-center bg-[#FFF7F0] p-6"
        >
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg"
            >
                <h1 className="mb-2 text-3xl font-bold text-[#302630]">
                    {text.title}
                </h1>

                <p className="mb-6 text-[#746673]">
                    {text.subtitle}
                </p>

                {error && (
                    <div
                        role="alert"
                        className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600"
                    >
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-[#302630]">
                        {text.email}
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                        dir="ltr"
                        className="w-full rounded-xl border border-[#EADFE7] px-4 py-3 outline-none focus:border-[#9878E8]"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-[#302630]">
                        {text.password}
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        dir="ltr"
                        className="w-full rounded-xl border border-[#EADFE7] px-4 py-3 outline-none focus:border-[#9878E8]"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[#9878E8] px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? text.signingIn : text.signIn}
                </button>
            </form>
        </div>
    );
}
