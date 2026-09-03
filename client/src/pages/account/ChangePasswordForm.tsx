import React, {useState} from 'react';
import PasswordInput from "../../components/form/passwordInput/PasswordInput.tsx";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";
import {useAuth} from "../../context/auth/AuthContext.tsx";
import {parseAxiosError} from "../../functions/parseAxiosError.ts";

export default function ChangePasswordForm(): React.ReactElement {

    const {changePassword} = useAuth();

    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    function handleSubmit(): void {
        setLoading(true);
        setError(null);
        setSuccess(false);

        changePassword({oldPassword, newPassword})
            .then(() => {
                setError(null);
                setSuccess(true);
            })
            .catch(err => setError(parseAxiosError(err)))
            .finally(() => setLoading(false));
    }

    return (
        <React.Fragment>
            <form className={"horizontal"}>

                <PasswordInput value={oldPassword} setValue={setOldPassword} label={"Enter old password"} />

                <PasswordInput value={newPassword} setValue={setNewPassword} label={"Enter new password"} />
                <PasswordInput value={confirmNewPassword} setValue={setConfirmNewPassword} label={"Confirm new password"} confirm />
            </form>

            <FancyButton label={"Submit"} onClick={handleSubmit} disabled={loading} />
            {error && <p className={"errorText"}>{error}</p>}
            {success && <p className={"successText"}>Password successfully updated!</p>}
        </React.Fragment>
    )
}