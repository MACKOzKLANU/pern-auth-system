import RequestReset from "../resetPassword/RequestReset";
import VerifyResetOtp from "../resetPassword/VerifyResetOtp";
import SetNewPassword from "../resetPassword/SetNewPassword";
import { useState } from "react";

function ResetPassword() {
    const [email, setEmail] = useState("")
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [resetToken, setResetToken] = useState(null);    
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            {!isEmailSent && <RequestReset email={email} setEmail={setEmail} setIsEmailSent={setIsEmailSent}></RequestReset>}
            {(isEmailSent && !isOtpSubmitted) && <VerifyResetOtp email={email} setIsOtpSubmitted={setIsOtpSubmitted} setResetToken={setResetToken}></VerifyResetOtp>}
            {isOtpSubmitted && <SetNewPassword email={email} resetToken={resetToken}></SetNewPassword>}
        </div>
    )
}

export default ResetPassword;