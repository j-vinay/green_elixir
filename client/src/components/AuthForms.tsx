// client/src/components/AuthForms.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter"; // <-- use wouter for navigation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { signUpSchema, signInSchema, type SignUpData, type SignInData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface AuthFormsProps {
  onSuccess?: () => void;
}

export function AuthForms({ onSuccess }: AuthFormsProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation(); // wouter setter

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function parseErrorMessage(res: Response) {
    try {
      const json = await res.json();
      if (json?.message) return json.message;
      if (typeof json === "string") return json;
    } catch {
      try {
        const text = await res.text();
        if (text) return text;
      } catch {
        /* ignore */
      }
    }
    return `Request failed with status ${res.status}`;
  }

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpData) => {
      const res = await fetch("/api/signup", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.name ?? null,
          lastName: null,
        }),
      });

      if (!res.ok) throw new Error(await parseErrorMessage(res));
      return res.json().catch(() => null);
    },
    onSuccess: (user: any) => {
      toast({
        title: "Account created!",
        description: "Your account was created. Please sign in to continue.",
      });
      setIsSignUp(false);
      signUpForm.reset();
      if (user?.email) signInForm.setValue("email", user.email);
    },
    onError: (err: any) =>
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: err?.message || "Failed to create account.",
      }),
  });

  const signInMutation = useMutation({
    mutationFn: async (data: SignInData) => {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!res.ok) throw new Error(await parseErrorMessage(res));
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      // refresh auth user data so navbar updates
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });

      // call parent handler to close dialog (if any)
      if (onSuccess) onSuccess();

      // navigate to landing page (root "/")
      setLocation("/");
    },
    onError: (err: any) =>
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: err?.message || "Invalid email or password.",
      }),
  });

  const onSignUpSubmit = (data: SignUpData) => signUpMutation.mutate(data);
  const onSignInSubmit = (data: SignInData) => signInMutation.mutate(data);

  const signUpLoading = signUpMutation.isLoading;
  const signInLoading = signInMutation.isLoading;

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
          <CardDescription className="text-center">
            {isSignUp ? "Enter your information to create your account" : "Enter your email and password to sign in"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSignUp ? (
            <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="signup-name" placeholder="Enter your full name" className="pl-9" data-testid="input-signup-name" {...signUpForm.register("name")} />
                </div>
                {signUpForm.formState.errors.name && (
                  <Alert variant="destructive">
                    <AlertDescription>{signUpForm.formState.errors.name.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="signup-email" type="email" placeholder="Enter your email" className="pl-9" data-testid="input-signup-email" {...signUpForm.register("email")} />
                </div>
                {signUpForm.formState.errors.email && (
                  <Alert variant="destructive">
                    <AlertDescription>{signUpForm.formState.errors.email.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" className="pl-9 pr-9" data-testid="input-signup-password" {...signUpForm.register("password")} />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} data-testid="button-toggle-signup-password">
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
                {signUpForm.formState.errors.password && (
                  <Alert variant="destructive">
                    <AlertDescription>{signUpForm.formState.errors.password.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={signUpLoading} data-testid="button-signup-submit">
                {signUpLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          ) : (
            <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="signin-email" type="email" placeholder="Enter your email" className="pl-9" data-testid="input-signin-email" {...signInForm.register("email")} />
                </div>
                {signInForm.formState.errors.email && (
                  <Alert variant="destructive">
                    <AlertDescription>{signInForm.formState.errors.email.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="signin-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className="pl-9 pr-9" data-testid="input-signin-password" {...signInForm.register("password")} />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} data-testid="button-toggle-signin-password">
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
                {signInForm.formState.errors.password && (
                  <Alert variant="destructive">
                    <AlertDescription>{signInForm.formState.errors.password.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={signInLoading} data-testid="button-signin-submit">
                {signInLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          )}

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                signUpForm.reset();
                signInForm.reset();
                setShowPassword(false);
              }}
              data-testid="button-toggle-auth-mode"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
