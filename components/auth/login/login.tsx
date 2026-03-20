"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SignInCredentials } from "@/types/user";
import { authService } from "@/services/auth";
import { error, success } from "@/components/alert";
import NetworkError from "@/utils/network-error";
import { setCookie } from "cookies-next";
import { userService } from "@/services/user";
import { useFcmToken } from "@/hook/use-fcm-token";
import useUserStore from "@/global-store/user";
import { useRouter, useSearchParams } from "next/navigation";
import { useSyncServer } from "@/hook/use-sync-server";
import useAddressStore from "@/global-store/address";
import { InputTypeChanger } from "@/app/(auth)/input-type-changer";
import { PhoneInput } from "@/components/phone-input";
import SocialLogin from "../social-login";
import { AuthScreenProps } from "../types";
import Link from "next/link";
import Image from "next/image";

const Login = ({ onViewChange, redirectOnSuccess }: AuthScreenProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const country = useAddressStore((state) => state.country);
  const [currentType, setCurrentType] = useState<"email" | "phone">("email");
  const [rememberMe, setRememberMe] = useState(false);
  
  const schema = yup.object({
    email: currentType === "email" ? yup.string().email().required() : yup.string().optional(),
    phone: currentType === "phone" ? yup.string().required(t("required")) : yup.string().optional(),
    password: yup.string().required(),
  });
  
  type FormType = yup.InferType<typeof schema>;
  const { handleSync } = useSyncServer();
  const { mutate: signIn, isLoading: isSigningIn } = useMutation({
    mutationFn: (body: SignInCredentials) => authService.login(body),
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });
  
  const { fcmToken } = useFcmToken();
  const localSignIn = useUserStore((state) => state.signIn);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<FormType>({
    resolver: yupResolver(schema),
  });
  
  const handleLogin = (data: FormType) => {
    const body: SignInCredentials = {
      password: data.password,
    };
    if (currentType === "email") {
      body.email = data.email;
    } else {
      body.phone = data.phone?.replace(/[^0-9]/g, "");
    }
    signIn(body, {
      onSuccess: (res) => {
        success(t("successfully.logged.in"));
        setCookie("token", `${res.data.token_type} ${res.data.access_token}`);
        if (fcmToken) {
          userService.updateFirebaseToken({ firebase_token: fcmToken });
        }
        localSignIn(res.data.user);
        handleSync();
        if (!redirectOnSuccess) return;
        if (searchParams.has("redirect")) {
          router.replace(searchParams.get("redirect") as string);
        } else {
          router.replace("/");
        }
      },
    });
  };

  return (
    <div className="form-style1">
      <div className="text-center mb40">
        <Link href="/">
          <Image
            width={138}
            height={44}
            className="mb25"
            src="/images/header-logo2.svg"
            alt="logo"
          />
        </Link>
        <h2 className="text-[30px] font-semibold mb-2">{t("sign.in")}</h2>
        <p className="text text-gray-600">
          {t("sign.in.with.account")}
        </p>
      </div>

      <SocialLogin redirectOnSuccess={redirectOnSuccess} />
      
      <div className="hr_content mb20">
        <hr />
        <span className="hr_top_text">{t("or")}</span>
      </div>

      <InputTypeChanger value={currentType} onChange={setCurrentType} />
      
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="flex flex-col gap-4 mb-4">
          {currentType === "phone" ? (
            <div className="mb25">
              <label className="form-label fw600 dark-color">
                {t("phone.number")}
              </label>
              <PhoneInput
                country={country?.code}
                value={watch("phone")}
                error={errors.phone?.message}
                onChange={(value) => setValue("phone", value)}
                className="form-control"
              />
            </div>
          ) : (
            <div className="mb25">
              <label className="form-label fw600 dark-color">
                {t("email")}
              </label>
              <Input
                {...register("email")}
                error={errors.email?.message}
                fullWidth
                placeholder={t("enter.email")}
                className="form-control"
              />
            </div>
          )}
          
          <div className="mb15">
            <label className="form-label fw600 dark-color">
              {t("password")}
            </label>
            <Input
              {...register("password")}
              error={errors.password?.message}
              fullWidth
              type="password"
              placeholder={t("enter.password")}
              className="form-control"
            />
          </div>
        </div>

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
          <button
            type="button"
            onClick={() => onViewChange("FORGOT_PASSWORD")}
            className="fz14 ff-heading text-blue-600 hover:underline bg-transparent border-0"
          >
            {t("lost.password")}
          </button>
        </div>

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
      </form>

      <p className="dark-color text-center mb0 mt10">
        {t("not.signed.up")}{" "}
        <button
          type="button"
          onClick={() => onViewChange("SIGN_UP")}
          className="dark-color fw600 bg-transparent border-0 hover:underline"
        >
          {t("create.account")}
        </button>
      </p>
    </div>
  );
};

export default Login;