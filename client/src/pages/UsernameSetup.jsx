import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { useAuth } from "../context/authContext";
import { useOnboarding } from "../context/OnboardingContext";
import authService from "../services/authService";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/auth/FormField";
import { AtSign, Check, X, Loader2, ShirtIcon } from "lucide-react";
import { toast } from "sonner";
import LiquidEther from "@/components/backgrounds/LiquidEther";
import { useDebounce } from "@/hooks/useDebounce";

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot be more than 20 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Only lowercase letters, numbers, and underscores allowed"
    ),
});

const UsernameSetup = () => {
  const { t } = useTranslation();
  const { user, setUsername: setUserUsername } = useAuth();
  const { triggerOnboarding } = useOnboarding();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: "" },
  });

  const watchUsername = watch("username");
  const debouncedUsername = useDebounce(watchUsername, 500);

  const checkAvailability = useCallback(async (username) => {
    if (!username || username.length < 3) {
      setIsAvailable(null);
      return;
    }

    // Validate format first
    if (!/^[a-z0-9_]+$/.test(username)) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      const result = await authService.checkUsername(username);
      setIsAvailable(result.available);
    } catch {
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkAvailability(debouncedUsername);
  }, [debouncedUsername, checkAvailability]);

  // Redirect if user already has username
  useEffect(() => {
    if (user?.isProfileComplete) {
      navigate("/collection");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    if (!isAvailable) {
      toast.error(t("auth.usernameTaken") || "Username is not available");
      return;
    }

    try {
      await setUserUsername(data.username);
      toast.success(t("auth.usernameSet") || "Username set successfully!");
      triggerOnboarding();
      navigate("/collection");
    } catch (error) {
      toast.error(error.response?.data?.message || t("auth.usernameSetFailed") || "Failed to set username");
    }
  };

  const getStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-slate-400" />;
    }
    if (isAvailable === true) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (isAvailable === false) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
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

      {/* Centered Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border border-white/20 dark:border-slate-700/50 p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-900 dark:bg-white rounded-xl">
                  <ShirtIcon className="h-6 w-6 text-white dark:text-slate-900" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  Football Shirts
                </span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {t("auth.chooseUsername") || "Choose your username"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                {t("auth.usernameDescription") || "This will be your unique profile URL"}
              </p>
            </div>

            {/* Preview URL */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 mb-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                footballshirtcollection.app/profile/
                <span className="font-medium text-slate-900 dark:text-white">
                  {watchUsername || "username"}
                </span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <FormField
                  id="username"
                  label={t("auth.username") || "Username"}
                  type="text"
                  placeholder="john_doe"
                  leftIcon={AtSign}
                  rightIcon={() => getStatusIcon()}
                  error={errors.username?.message || (isAvailable === false ? (t("auth.usernameTaken") || "Username is taken") : null)}
                  register={register("username")}
                  required
                />
              </div>

              {/* Username Requirements */}
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p>{t("auth.usernameRequirements") || "Username requirements:"}</p>
                <ul className="list-disc list-inside ml-2 space-y-0.5">
                  <li>{t("auth.usernameReq1") || "3-20 characters"}</li>
                  <li>{t("auth.usernameReq2") || "Lowercase letters, numbers, underscores only"}</li>
                  <li>{t("auth.usernameReq3") || "Must be unique"}</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 rounded-lg text-base font-medium mt-2 transition-all duration-200 hover:shadow-md"
                disabled={isSubmitting || !isAvailable || isChecking}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.settingUsername") || "Setting username..."}
                  </>
                ) : (
                  t("auth.continue") || "Continue"
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UsernameSetup;
