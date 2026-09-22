import { COLOR, RADIUS, SPACE, TARGET } from "@life-os/tokens";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { sendEmailOtp, verifyEmailOtp } from "../../lib/auth.ts";

/**
 * Email OTP sign-in — the flow primitive's first real caller.
 *
 * Two questions, one per screen: the address, then the code. §5.7 says not to
 * front-load setup; this is the shortest path to a usable app, and everything
 * else is asked later in context.
 */
type Stage = "email" | "code";

/**
 * Inputs take style objects because a TextInput's own text colour and padding
 * are not expressible as NativeWind classes on every platform. Still the
 * semantic tier — a hex here would be exactly the defect it is anywhere else.
 */
const inputStyle = {
  minHeight: TARGET["tap-target-min"],
  borderWidth: 1,
  borderColor: COLOR["border-meaningful"],
  borderRadius: RADIUS["radius-md"],
  paddingHorizontal: SPACE["space-4"],
  color: COLOR["text-primary"],
  fontSize: 16,
} as const;

export function SignInFlow({ onSignedIn }: { onSignedIn: () => void }) {
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fail = (e: unknown) =>
    setError(e instanceof Error ? e.message : "Something went wrong.");

  async function submitEmail() {
    setBusy(true);
    setError(null);
    try {
      await sendEmailOtp(email);
      setStage("code");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  async function submitCode() {
    setBusy(true);
    setError(null);
    try {
      await verifyEmailOtp(email, code);
      onSignedIn();
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  const isEmail = stage === "email";

  return (
    <View className="flex-1 bg-base">
      <View className="flex-1 justify-center px-4 pb-8 pt-8">
        <View className="mb-6 flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => {
              if (!isEmail) {
                setStage("email");
                setError(null);
              }
            }}
            disabled={isEmail}
            style={{ opacity: isEmail ? 0.35 : 1 }}
          >
            <Text className="text-base font-medium text-primary">Back</Text>
          </Pressable>

          <Text className="text-sm text-muted">
            {isEmail ? "Step 1 of 2" : "Step 2 of 2"}
          </Text>
        </View>

        <View className="mb-6 items-center">
          <View className="mb-3 h-14 w-14 items-center justify-center rounded-2xl bg-accent-primary/15">
            <Text className="text-xl font-semibold text-accent-primary">L</Text>
          </View>
          <Text className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Life OS
          </Text>
        </View>

        <View className="rounded-[28px] border border-meaningful bg-surface p-5 shadow-sm">
          <Text
            accessibilityRole="header"
            className="text-3xl font-semibold leading-tight text-primary"
          >
            {isEmail ? "Welcome back" : "Verify your email"}
          </Text>
          <Text className="mt-2 text-base leading-relaxed text-muted">
            {isEmail
              ? "Sign in with your email to receive a secure one-time code."
              : `We sent a code to ${email}. Enter it below to finish signing in.`}
          </Text>

          <View className="mt-6 gap-4">
            <View className="rounded-2xl border border-meaningful bg-surface/80 px-4 py-3">
              <Text className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {isEmail ? "Email address" : "Verification code"}
              </Text>

              {isEmail ? (
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={COLOR["text-muted"]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  accessibilityLabel="Email address"
                  style={inputStyle}
                  returnKeyType="done"
                />
              ) : (
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="123456"
                  placeholderTextColor={COLOR["text-muted"]}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoComplete="one-time-code"
                  accessibilityLabel="One-time code"
                  style={inputStyle}
                  returnKeyType="done"
                />
              )}
            </View>

            {error !== null && (
              <View className="rounded-xl border border-state-error/40 bg-state-error/10 px-3 py-2">
                <Text className="text-sm text-state-error">{error}</Text>
              </View>
            )}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isEmail ? "Continue with email" : "Verify sign in code"}
          onPress={() => void (isEmail ? submitEmail() : submitCode())}
          disabled={busy || (isEmail ? email.trim() === "" : code.trim() === "")}
          style={{
            opacity: busy || (isEmail ? email.trim() === "" : code.trim() === "") ? 0.5 : 1,
            minHeight: TARGET["tap-target-min"],
            marginTop: SPACE["space-6"],
            backgroundColor: COLOR["accent-primary"],
            borderRadius: RADIUS["radius-md"],
          }}
          className="items-center justify-center"
        >
          <Text className="text-base font-semibold text-on-warm">
            {busy ? "Working…" : isEmail ? "Continue" : "Sign in"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
