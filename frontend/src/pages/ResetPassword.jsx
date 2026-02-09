import RequestReset from "../resetPassword/RequestReset";
import VerifyResetOtp from "../resetPassword/VerifyResetOtp";
import SetNewPassword from "../resetPassword/SetNewPassword";

function ResetPassword() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <RequestReset></RequestReset>
            {/* <VerifyResetOtp></VerifyResetOtp>
            <SetNewPassword></SetNewPassword> */}
        </div>
    )
}

export default ResetPassword;