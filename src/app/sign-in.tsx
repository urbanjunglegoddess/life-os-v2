import { ObserveInteractiveMarker } from "expo-observe";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { SignInFlow } from "../components/auth/SignInFlow.tsx";

export default function SignInRoute() {
  return (
    <SafeAreaView className="flex-1 bg-base">
      <SignInFlow onSignedIn={() => router.replace("/today")} />
      {/* The signed-out entry point: interactive as soon as it mounts. */}
      <ObserveInteractiveMarker />
    </SafeAreaView>
  );
}
