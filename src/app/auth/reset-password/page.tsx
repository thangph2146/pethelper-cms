'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResetPasswordSchema, resetPasswordSchema } from "@/types/form";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get("token");

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: ResetPasswordSchema) => {
    if (!token) {
      toast.error("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
      router.push("/auth/forgot-password");
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.resetPassword(values.password, token);
      toast.success("Đặt lại mật khẩu thành công");
      router.push("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Có lỗi xảy ra khi đặt lại mật khẩu");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
      router.push("/auth/forgot-password");
    }
  }, [token, router]);

  const passwordStrength = form.watch("password");
  const hasUpperCase = /[A-Z]/.test(passwordStrength);
  const hasLowerCase = /[a-z]/.test(passwordStrength);
  const hasNumber = /[0-9]/.test(passwordStrength);
  const isLengthValid = passwordStrength.length >= 6;

  if (!token) {
    return null;
  }

  return (
    <div className="container relative flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>

      <Card className="mx-auto w-full max-w-[400px]">
        <CardHeader className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Đặt lại mật khẩu
          </h1>
          <p className="text-sm text-muted-foreground">
            Nhập mật khẩu mới của bạn bên dưới
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu mới"
                          className="h-11 pr-10"
                          autoComplete="new-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 w-11 px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="space-y-2">
                      <p>Mật khẩu phải đáp ứng các yêu cầu sau:</p>
                      <ul className="list-inside list-disc space-y-1 text-sm">
                        <li className={isLengthValid ? "text-green-500" : ""}>
                          Ít nhất 6 ký tự
                        </li>
                        <li className={hasUpperCase ? "text-green-500" : ""}>
                          Ít nhất 1 chữ hoa
                        </li>
                        <li className={hasLowerCase ? "text-green-500" : ""}>
                          Ít nhất 1 chữ thường
                        </li>
                        <li className={hasNumber ? "text-green-500" : ""}>
                          Ít nhất 1 số
                        </li>
                      </ul>
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Xác nhận mật khẩu mới"
                          className="h-11 pr-10"
                          autoComplete="new-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 w-11 px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Đang xử lý</span>
                  </>
                ) : (
                  <span>Đặt lại mật khẩu</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground">
            Đã nhớ mật khẩu?{" "}
            <Button
              variant="link"
              className="px-0 text-primary font-medium hover:text-primary/90"
              onClick={() => router.push("/auth/login")}
            >
              Đăng nhập
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 