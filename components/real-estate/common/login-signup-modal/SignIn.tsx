"use client"
import { Input } from "@/components/input/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";
import { useState } from "react";

import { authService } from "@/services/auth";
import { userService } from "@/services/user";
import { SignInCredentials } from "@/types/user";
import { error, success } from "@/components/alert";
import NetworkError from "@/utils/network-error";
import { useFcmToken } from "@/hook/use-fcm-token";
import useUserStore from "@/global-store/user";
import { useSyncServer } from "@/hook/use-sync-server";
import { PhoneInput } from "@/components/phone-input";
import useAddressStore from "@/global-store/address";
import { Button } from "@/components/button";

// Helper function to detect if input is email or phone
const isEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isPhone = (value: string) => {
  // Remove all non-numeric characters and check if it's a valid phone number
  const numericValue = value.replace(/[^0-9]/g, "");
  return numericValue.length >= 8; // Minimum phone number length
};

const SignIn = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const country = useAddressStore((state) => state.country);
  const { fcmToken } = useFcmToken();
  const { handleSync } = useSyncServer();
  const localSignIn = useUserStore((state) => state.signIn);
  
  const [loginMethod, setLoginMethod] = useState<"auto" | "email" | "phone">("auto");
  const [rememberMe, setRememberMe] = useState(false);

  // Dynamic validation schema based on login method
  const schema = yup.object({
    identifier: yup.string()
      .required(t("identifier.required"))
      .test('identifier', t("invalid.identifier"), function(value) {
        if (!value) return false;
        
        // Auto-detect mode
        if (loginMethod === "auto") {
          return isEmail(value) || isPhone(value);
        }
        
        // Email mode
        if (loginMethod === "email") {
          return isEmail(value);
        }
        
        // Phone mode
        if (loginMethod === "phone") {
          return isPhone(value);
        }
        
        return false;
      }),
    password: yup.string().required(t("password.required")),
  });

  type FormType = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<FormType>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const identifier = watch("identifier");

  // Auto-detect login method based on input
  const handleIdentifierChange = (value: string) => {
    setValue("identifier", value, { shouldValidate: true });
    
    if (value) {
      if (isEmail(value)) {
        setLoginMethod("email");
      } else if (isPhone(value)) {
        setLoginMethod("phone");
      } else {
        setLoginMethod("auto");
      }
    } else {
      setLoginMethod("auto");
    }
  };

  // Login mutation
  const { mutate: signIn, isLoading: isSigningIn } = useMutation({
    mutationFn: (body: SignInCredentials) => authService.login(body),
    onError: (err: NetworkError) => {
      error(err.message);
    },
    onSuccess: (res) => {
      success(t("successfully.logged.in"));
      
      // Set token cookie with remember me option
      setCookie("token", `${res.data.token_type} ${res.data.access_token}`, {
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days if remember me
        path: "/",
      });

      // Update FCM token if available
      if (fcmToken) {
        userService.updateFirebaseToken({ fire_token: fcmToken });
      }

      localSignIn(res.data.user);
      handleSync();

      // Handle redirect
      const redirectPath = searchParams.get("redirect");
      if (redirectPath) {
        router.replace(redirectPath);
      } else {
        router.replace("/");
      }
    },
  });

  const onSubmit = (data: FormType) => {
    const body: SignInCredentials = {
      password: data.password,
    };

    // Determine if identifier is email or phone
    if (isEmail(data.identifier)) {
      body.email = data.identifier;
    } else {
      // Clean phone number - remove all non-numeric characters
      body.phone = data.identifier.replace(/[^0-9]/g, "");
    }

    signIn(body);
  };

  // Get input placeholder based on detected method
  const getPlaceholder = () => {
    if (loginMethod === "email") return t("enter.email");
    if (loginMethod === "phone") return t("enter.phone.number");
    return t("enter.email.or.phone");
  };

  // Get input type based on detected method
  const getInputType = () => {
    if (loginMethod === "email") return "email";
    if (loginMethod === "phone") return "tel";
    return "text";
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit(onSubmit)}>
      {/* Identifier Input (Email or Phone) */}
      <div className="mb25">
        <label className="form-label fw600 dark-color">
          {t("email.or.phone")}
        </label>
        {loginMethod === "phone" ? (
          <PhoneInput
            country={country?.code}
            value={identifier || ""}
            error={errors.identifier?.message}
            onChange={handleIdentifierChange}
            placeholder={getPlaceholder()}
          />
        ) : (
          <Input
            type={getInputType()}
            value={identifier || ""}
            onChange={(e) => handleIdentifierChange(e.target.value)}
            error={errors.identifier?.message}
            fullWidth
            placeholder={getPlaceholder()}
            className={`form-control ${errors.identifier ? 'is-invalid' : ''}`}
          />
        )}
        {/* Show detected method hint */}
        {identifier && loginMethod !== "auto" && (
          <small className="text-muted mt-1 d-block">
            {loginMethod === "email" ? t("using.email") : t("using.phone")}
          </small>
        )}
      </div>

      {/* Password Input */}
      <div className="mb15">
        <label className="form-label fw600 dark-color">
          {t("password")}
        </label>
        <Input
          type="password"
          {...register("password")}
          error={errors.password?.message}
          fullWidth
          placeholder={t("enter.password")}
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
        />
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb10">
        <label className="custom_checkbox fz14 ff-heading">
          {t("remember.me")}
          <input 
            type="checkbox" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span className="checkmark" />
        </label>
        <Link href="/forgot-password" className="fz14 ff-heading">
          {t("lost.password")}
        </Link>
      </div>

      {/* Submit Button */}
      <div className="d-grid mb20">
        <Button
            type="submit"
            loading={isSigningIn}
            disabled={Boolean(queryClient.isMutating())}
            className="ud-btn btn-thm w-100"
            fullWidth
          >
            {t("sign.in")} <i className="fal fa-arrow-right-long" />
          </Button>
      </div>

      {/* OR Divider */}
      <div className="hr_content mb20">
        <hr />
        <span className="hr_top_text">{t("or")}</span>
      </div>

      {/* Social Login Buttons */}
      <div className="d-grid mb10">
        <button className="ud-btn btn-white" type="button">
          <i className="fab fa-google" /> {t("continue.with.google")}
        </button>
      </div>
      <div className="d-grid mb10">
        <button className="ud-btn btn-fb" type="button">
          <i className="fab fa-facebook-f" /> {t("continue.with.facebook")}
        </button>
      </div>
      <div className="d-grid mb20">
        <button className="ud-btn btn-apple" type="button">
          <i className="fab fa-apple" /> {t("continue.with.apple")}
        </button>
      </div>

      {/* Sign Up Link */}
      <p className="dark-color text-center mb0 mt10">
        {t("not.signed.up")}{" "}
        <Link className="dark-color fw600" href="/register">
          {t("create.account")}
        </Link>
      </p>
    </form>
  );
};

export default SignIn;