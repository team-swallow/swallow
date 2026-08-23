"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleLoginWithEmail = async () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // set this to false if you do not want the user to be automatically signed up
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setSentTo(email);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              disabled={!!sentTo}
              onChange={(e) => setEmail(e.target.value)}
            />
            {sentTo && (
              <FieldDescription>
                We sent a Magic Link. Click the link to log in.
              </FieldDescription>
            )}
          </Field>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        {!sentTo ? (
          <Button
            variant="default"
            disabled={isLoading}
            onClick={handleLoginWithEmail}
            className="w-full"
          >
            Login with Email
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => {
              setEmail("");
              setSentTo(null);
            }}
            className="w-full"
          >
            Login with Another Email
          </Button>
        )}
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={handleLoginWithGoogle}
          className="w-full"
        >
          Login with Google
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </CardFooter>
    </Card>
  );
}
