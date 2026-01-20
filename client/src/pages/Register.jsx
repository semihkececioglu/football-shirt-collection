import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "@/components/common/SEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/authContext";
import { useOnboarding } from "../context/OnboardingContext";
import authService from "../services/authService";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/auth/FormField";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AtSign,
  ShirtIcon,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import LiquidEther from "@/components/backgrounds/LiquidEther";
import { useDebounce } from "@/hooks/useDebounce";
import { trackSignUp } from "@/lib/firebase";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot be more than 20 characters")
      .regex(
        /^[a-z0-9_]+$/,
        "Only lowercase letters, numbers, and underscores allowed"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { register: registerUser, googleAuth } = useAuth();
  const { triggerOnboarding } = useOnboarding();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", username: "", email: "", password: "", confirmPassword: "" },
  });

  const watchPassword = watch("password");
  const watchUsername = watch("username");
  const debouncedUsername = useDebounce(watchUsername, 500);

  // Check username availability
  const checkUsernameAvailability = useCallback(async (username) => {
    if (!username || username.length < 3) {
      setIsUsernameAvailable(null);
      return;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      setIsUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const result = await authService.checkUsername(username);
      setIsUsernameAvailable(result.available);
    } catch {
      setIsUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  }, []);

  useEffect(() => {
    checkUsernameAvailability(debouncedUsername);
  }, [debouncedUsername, checkUsernameAvailability]);

  const getUsernameStatusIcon = () => {
    if (isCheckingUsername) {
      return <Loader2 className="h-4 w-4 animate-spin text-slate-400" />;
    }
    if (isUsernameAvailable === true) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (isUsernameAvailable === false) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const onSubmit = async (data) => {
    if (isUsernameAvailable === false) {
      toast.error(t("auth.usernameTaken") || "Username is already taken");
      return;
    }

    try {
      await registerUser({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      trackSignUp("email");
      toast.success(t("auth.accountCreated"));
      triggerOnboarding();
      navigate("/collection");
    } catch (error) {
      toast.error(error.response?.data?.message || t("auth.registrationFailed"));
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (response) => {
      setIsGoogleLoading(true);
      try {
        // Use access token for backend authentication
        const result = await googleAuth(response.access_token);

        if (result.data.isProfileComplete) {
          trackSignUp("google");
          toast.success(t("auth.welcomeBack"));
          navigate("/collection");
        } else {
          trackSignUp("google");
          // Redirect to username setup
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
        title="Register"
        description="Create your Football Shirt Collection account. Start tracking your jersey collection today."
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
                  {t("auth.startYour")}
                  <br />
                  {t("auth.collectionJourney")}
                </h2>
                <p className="text-lg text-slate-300">
                  {t("auth.joinCollectors")}
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
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {t("auth.registerTitle")}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                  {t("auth.registerSubtitle")}
                </p>
              </div>

              {/* Google Button */}
              <GoogleButton onClick={() => handleGoogleSignIn()} isLoading={isGoogleLoading}>
                {t("auth.continueWithGoogle") || "Continue with Google"}
              </GoogleButton>

              {/* Divider */}
              <AuthDivider text={t("auth.or") || "or"} />

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Name Field */}
                <FormField
                  id="name"
                  label={t("auth.name")}
                  type="text"
                  placeholder={t("auth.namePlaceholder")}
                  leftIcon={User}
                  error={errors.name?.message}
                  register={register("name")}
                  required
                />

                {/* Username Field */}
                <FormField
                  id="username"
                  label={t("auth.username") || "Username"}
                  type="text"
                  placeholder="john_doe"
                  leftIcon={AtSign}
                  rightIcon={() => getUsernameStatusIcon()}
                  error={errors.username?.message || (isUsernameAvailable === false ? (t("auth.usernameTaken") || "Username is taken") : null)}
                  register={register("username")}
                  required
                />

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

                {/* Password Field with Strength Indicator */}
                <div className="space-y-2">
                  <FormField
                    id="password"
                    label={t("auth.password")}
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.createPassword")}
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

                  {/* Password Strength Indicator */}
                  {watchPassword && <PasswordStrength password={watchPassword} />}
                </div>

                {/* Confirm Password Field */}
                <FormField
                  id="confirmPassword"
                  label={t("auth.confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("auth.confirmPasswordPlaceholder")}
                  leftIcon={Lock}
                  rightIcon={() => (
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      aria-label={
                        showConfirmPassword ? t("auth.hidePassword") : t("auth.showPassword")
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  error={errors.confirmPassword?.message}
                  register={register("confirmPassword")}
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
                      {t("auth.creatingAccount")}
                    </>
                  ) : (
                    t("auth.register")
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                  {t("auth.hasAccount")}{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
                  >
                    {t("auth.signIn")}
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

export default Register;
