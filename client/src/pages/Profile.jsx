import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "@/components/common/SEO";
import {
  Mail,
  Calendar,
  Lock,
  Trash2,
  Shirt,
  Star,
  Heart,
  Wallet,
  Camera,
  Loader2,
  Check,
  AlertTriangle,
  X,
  User,
  Pencil,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/authContext";
import { useCurrency } from "@/context/CurrencyContext";
import authService from "@/services/authService";
import { useOverviewStats } from "@/hooks/useStats";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 800 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated || value === undefined || value === null) return;

    const numericValue = typeof value === "number" ? value : 0;

    if (numericValue === 0) {
      setDisplayValue(0);
      setHasAnimated(true);
      return;
    }

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(numericValue * easeOut);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue);
        setHasAnimated(true);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, hasAnimated]);

  return <span>{displayValue.toLocaleString()}</span>;
};

// Stat Card Skeleton
const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
      <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
    </div>
    <div className="h-6 w-12 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
  </div>
);

// Stat Card Component
const StatCard = ({ stat, isLoading, index }) => {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-300"
      style={{ animationDelay: `${index * 75}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <stat.icon className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {stat.label}
        </span>
      </div>
      <p className="text-lg font-semibold text-slate-900 dark:text-white">
        {stat.isFormatted ? (
          stat.value
        ) : (
          <AnimatedCounter value={stat.value} />
        )}
      </p>
    </div>
  );
};

// Google Icon Component
const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  const { data: statsData, isLoading: isLoadingStats } = useOverviewStats();
  const { data: wishlistData, isLoading: isLoadingWishlist } = useWishlist();
  const stats = statsData?.data || {};
  const wishlistCount = wishlistData?.data?.length || 0;
  const isLoadingData = isLoadingStats || isLoadingWishlist;
  const fileInputRef = useRef(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const isGoogleUser = user?.authProvider === "google";
  const hasCustomAvatar = user?.avatar && !user.avatar.includes("googleusercontent.com");

  const handleAvatarClick = () => {
    setAvatarDialogOpen(true);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("profile.avatarTooLarge") || "Image must be less than 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const response = await authService.updateAvatar(file);
      if (response.success) {
        updateUser({ avatar: response.data.avatar });
        toast.success(t("profile.avatarUpdated") || "Avatar updated");
        setAvatarDialogOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("profile.avatarUpdateFailed") || "Failed to update avatar");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setIsRemovingAvatar(true);
    try {
      const response = await authService.updateProfile({ avatar: "" });
      if (response.success) {
        updateUser({ avatar: "" });
        toast.success(t("profile.avatarRemoved") || "Avatar removed");
        setAvatarDialogOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("profile.avatarRemoveFailed") || "Failed to remove avatar");
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        updateUser(response.data);
        toast.success(t("profile.updateSuccess") || "Profile updated");
        setEditDialogOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("profile.updateFailed") || "Failed to update");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t("profile.passwordMismatch") || "Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error(t("profile.passwordTooShort") || "Min 6 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success(t("profile.passwordChanged") || "Password changed");
      setPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Reset visibility states
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      toast.error(error.message || t("profile.passwordChangeFailed") || "Failed");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/account`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(
            isGoogleUser
              ? { confirmText: deleteConfirmText }
              : { password: deletePassword }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success(t("profile.accountDeleted") || "Account deleted");
      logout();
      navigate("/login");
    } catch (error) {
      toast.error(error.message || t("profile.deleteFailed") || "Failed");
      setIsDeletingAccount(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : "";

  const statsConfig = [
    {
      label: t("dashboard.totalShirts"),
      value: stats.totalShirts || 0,
      icon: Shirt,
    },
    {
      label: t("dashboard.totalInvestment"),
      value: formatCurrency((stats.totalInvestment || 0).toFixed(0)),
      icon: Wallet,
      isFormatted: true,
    },
    {
      label: t("dashboard.favorites"),
      value: stats.favoritesCount || 0,
      icon: Star,
    },
    {
      label: t("nav.wishlist"),
      value: wishlistCount,
      icon: Heart,
    },
  ];

  return (
    <>
      <SEO
        title="Profile"
        description="Manage your Football Shirt Collection profile. Update your information and account settings."
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />

        <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <button
            onClick={handleAvatarClick}
            className="relative group mb-3"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 border-slate-300 dark:border-slate-600">
                <User className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            {isGoogleUser && (
              <div className="absolute -bottom-0.5 -right-0.5 p-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                <GoogleIcon className="w-3 h-3" />
              </div>
            )}
          </button>

          {/* Name */}
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            {user?.name}
          </h1>

          {/* Username */}
          {user?.username && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              @{user.username}
            </p>
          )}

          {/* Email & Member Since */}
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {user?.email}
            </span>
            {memberSince && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {memberSince}
                </span>
              </>
            )}
          </div>

          {/* Edit Button */}
          <Button
            variant="outline"
            size="sm"
            className="mt-3 h-8 text-xs"
            onClick={() => setEditDialogOpen(true)}
          >
            {t("profile.editProfile")}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {statsConfig.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              isLoading={isLoadingData}
              index={index}
            />
          ))}
        </div>

        {/* Account Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          <div className="px-4 py-3">
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t("profile.account") || "Account"}
            </h3>
          </div>

          {/* Change Password - Only for local users */}
          {!isGoogleUser && (
            <button
              onClick={() => setPasswordDialogOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  {t("profile.changePassword")}
                </span>
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Connected Account - For Google users */}
          {isGoogleUser && (
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <GoogleIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm text-slate-700 dark:text-slate-200">Google</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <Check className="w-3 h-3" />
                {t("profile.connected") || "Connected"}
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900/50">
          <div className="px-4 py-3 border-b border-red-200 dark:border-red-900/50">
            <h3 className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {t("profile.dangerZone")}
            </h3>
          </div>
          <div className="p-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              {t("profile.dangerZoneDesc") || "This action cannot be undone."}
            </p>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              {t("profile.deleteAccount")}
            </Button>
          </div>
        </div>
      </main>

      {/* Avatar Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>{t("profile.changeAvatar") || "Profile Photo"}</DialogTitle>
            <DialogDescription>
              {t("profile.changeAvatarDesc") || "Upload a new photo or remove the current one."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-2">
            <Button
              variant="outline"
              onClick={handleFileSelect}
              disabled={isUploadingAvatar}
              className="justify-start"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Camera className="w-4 h-4 mr-2" />
              )}
              {t("profile.uploadPhoto") || "Upload Photo"}
            </Button>
            {(user?.avatar || hasCustomAvatar) && (
              <Button
                variant="outline"
                onClick={handleRemoveAvatar}
                disabled={isRemovingAvatar}
                className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                {isRemovingAvatar ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                {t("profile.removePhoto") || "Remove Photo"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Pencil className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <DialogTitle className="text-center">{t("profile.editProfile")}</DialogTitle>
            <DialogDescription className="text-center">
              {t("profile.subtitle") || "Update your profile information"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">{t("auth.name")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="pl-10"
                  placeholder={t("auth.name")}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("auth.email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={user?.email || ""}
                  disabled
                  className="pl-10 bg-slate-50 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                {t("profile.emailCannotChange") || "Email cannot be changed"}
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="flex-1 sm:flex-none"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingProfile}
                className="flex-1 sm:flex-none"
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("common.saving") || "Saving..."}
                  </>
                ) : (
                  t("common.save")
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <DialogTitle className="text-center">{t("profile.changePassword")}</DialogTitle>
            <DialogDescription className="text-center">
              {t("profile.security") || "Update your password to keep your account secure"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium">
                {t("profile.currentPassword")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                {t("profile.newPassword")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                {t("profile.passwordTooShort") || "Min 6 characters"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                {t("profile.confirmNewPassword")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {t("profile.passwordMismatch") || "Passwords do not match"}
                </p>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordDialogOpen(false)}
                className="flex-1 sm:flex-none"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="flex-1 sm:flex-none"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("common.saving") || "Saving..."}
                  </>
                ) : (
                  t("profile.changePassword")
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-center">
              {t("profile.deleteConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {t("profile.deleteConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 my-2">
            <p className="text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {t("profile.deleteAccountWarning") || "Once you delete your account, there is no going back. Please be certain."}
            </p>
          </div>

          <div className="space-y-2">
            {isGoogleUser ? (
              <>
                <Label htmlFor="deleteConfirm" className="text-sm font-medium">
                  {t("profile.typeDeleteConfirm") || 'Type "DELETE" to confirm'}
                </Label>
                <Input
                  id="deleteConfirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                  placeholder="DELETE"
                  className="font-mono text-center tracking-widest"
                  autoComplete="off"
                />
              </>
            ) : (
              <>
                <Label htmlFor="deletePassword" className="text-sm font-medium">
                  {t("profile.enterPasswordConfirm")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="deletePassword"
                    type={showDeletePassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showDeletePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </>
            )}
          </div>

          <AlertDialogFooter className="gap-2 sm:gap-2 pt-2">
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmText("");
                setDeletePassword("");
                setShowDeletePassword(false);
              }}
              className="flex-1 sm:flex-none"
            >
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={(isGoogleUser ? deleteConfirmText !== "DELETE" : !deletePassword) || isDeletingAccount}
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("common.deleting") || "Deleting..."}
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("profile.deleteAccount")}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
};

export default Profile;
