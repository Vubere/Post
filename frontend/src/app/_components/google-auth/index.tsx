import { GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import Button from "../general/button";
import Image from "next/image";
import googleIcon from "@/assets/icons/google.png";

interface Props {
  onSuccess: (credential: any) => void;
  onError: () => void;
  className?: string;
  loading?: boolean;
}

export default function GoogleAuth({ className, loading, ...config }: Props) {
  const gl = useGoogleLogin({
    ...config,
  })

  //use googleLogout to sign user out
  return (
    <Button onClick={() => gl()} theme="light" className={className} loading={loading} disabled={loading}>
      <span className="flex gap-2 justify-center items-center w-full">
        Sign In with Google <Image alt="google logo" src={googleIcon} width={25} height={25} />
      </span>
    </Button>
  )
}