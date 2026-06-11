"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldErrors = {
  name?: string;
  email?: string;
};

function validateClient(name: string, email: string): FieldErrors {
  const errors: FieldErrors = {};
  if (name.trim().length < 2) {
    errors.name = "Please enter your full name";
  }
  if (!email.trim()) {
    errors.email = "Please enter your email address";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Please enter a valid email address";
  }
  return errors;
}

export function CaptureForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccess(null);

    const errors = validateClient(name, email);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      const data = (await res.json()) as { error?: string; user?: { name: string } };

      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(`You're registered, ${data.user?.name ?? "friend"}. Taking you to the webinar…`);
      router.push("/webinar");
      router.refresh();
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md space-y-5 text-left"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[13px] font-semibold text-fta-ink">
          Your name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className={cn(fieldErrors.name && "border-red-500")}
          placeholder="Jane Smith"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) {
              setFieldErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
        {fieldErrors.name ? (
          <p id="name-error" className="text-sm text-red-700" role="alert">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[13px] font-semibold text-fta-ink">
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={cn(fieldErrors.email && "border-red-500")}
          placeholder="you@practice.co.uk"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) {
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
        {fieldErrors.email ? (
          <p id="email-error" className="text-sm text-red-700" role="alert">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p
          className="rounded-input border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      {success ? (
        <p
          className="rounded-input border border-[color-mix(in_srgb,var(--pill-available)_35%,transparent)] bg-[color-mix(in_srgb,var(--pill-available)_8%,white)] px-4 py-3 text-sm text-[#1F7A3A]"
          role="status"
        >
          {success}
        </p>
      ) : null}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Saving…" : "Register for the webinar"}
      </Button>
    </form>
  );
}
