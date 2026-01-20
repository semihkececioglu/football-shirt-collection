import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "@/components/common/SEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/authContext";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/auth/FormField";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { Mail, Lock, Eye, EyeOff, ShirtIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import LiquidEther from "@/components/backgrounds/LiquidEther";
import { trackLogin } from "@/lib/firebase";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, googleAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      trackLogin("email");
      toast.success(t("auth.welcomeBack"));
      navigate("/collection");
    } catch (error) {
      toast.error(error.response?.data?.message || t("auth.loginFailed"));
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (response) => {
      setIsGoogleLoading(true);
      try {
        const result = await googleAuth(response.access_token);

        if (result.data.isProfileComplete) {
          trackLogin("google");
          toast.success(t("auth.welcomeBack"));
          navigate("/collection");
        } else {
          trackLogin("google");
          navigate("/setup-username");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || t("auth.googleAuthFailed") || "Google sign-in failed");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error(t("auth.googleAuthFailed") || "Google sign-in failed");
    },
  });

  return (
    <>
      <SEO
        title="Login"
        description="Sign in to your Football Shirt Collection account. Access your collection and manage your jerseys."
      />
      <div className="min-h-screen relative overflow-hidden">
        {/* Full Page Liquid Ether Background */}
      <div className="absolute inset-0 bg-slate-900">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Brand Section (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-2/5 relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border-r border-white/20" />
          <div className="relative z-10 w-full h-full flex flex-col justify-between p-12">
            <div>
              <div className="flex items-center gap-3">
                <ShirtIcon className="h-10 w-10 text-white" />
                <span className="text-2xl font-bold text-white">
                  Football Shirts
                </span>
              </div>
              <div className="mt-24">
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                  {t("auth.trackYour")}
                  <br />
                  {t("auth.collection")}
                </h2>
                <p className="text-lg text-slate-300">
                  {t("auth.manageShirts")}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              © 2025 Football Shirts. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Card */}
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border border-white/20 dark:border-slate-700/50 p-8">
              {/* Mobile Logo */}
              <div className="flex justify-center lg:hidden mb-6">
                <div className="flex items-center gap-2.5">
                  <ShirtIcon className="h-8 w-8 text-slate-900 dark:text-white" />
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    Football Shirts
                  </span>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {t("auth.loginTitle")}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                  {t("auth.loginSubtitle")}
                </p>
              </div>

              {/* Google Button */}
              <GoogleButton onClick={() => handleGoogleSignIn()} isLoading={isGoogleLoading}>
                {t("auth.continueWithGoogle") || "Continue with Google"}
              </GoogleButton>

              {/* Divider */}
              <AuthDivider text={t("auth.or") || "or"} />

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <FormField
                  id="email"
                  label={t("auth.email")}
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  leftIcon={Mail}
                  error={errors.email?.message}
                  register={register("email")}
                  required
                />

                {/* Password Field */}
                <FormField
                  id="password"
                  label={t("auth.password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  leftIcon={Lock}
                  rightIcon={() => (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      aria-label={
                        showPassword ? t("auth.hidePassword") : t("auth.showPassword")
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  error={errors.password?.message}
                  register={register("password")}
                  required
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 rounded-lg text-base font-medium mt-2 transition-all duration-200 hover:shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.signingIn")}
                    </>
                  ) : (
                    t("auth.signIn")
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                  {t("auth.noAccount")}{" "}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
                  >
                    {t("auth.register")}
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Login;
