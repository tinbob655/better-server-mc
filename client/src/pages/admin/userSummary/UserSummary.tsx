import React, {useState, useRef, useEffect} from 'react';
import type {UserSummary} from "../../../types/auth";
import './userSummary.scss';
import {Permission} from "../../../types/permission.ts";
import {useAuth} from "../../../context/auth/AuthContext.tsx";
import {parseAxiosError} from "../../../functions/parseAxiosError.ts";

interface UserSummaryParams {
    user: UserSummary;
    onPermissionChanged: (username: string, newPermission: keyof typeof Permission) => void;
}

export default function UserSummary({user, onPermissionChanged}: UserSummaryParams): React.ReactElement {

    const {changePermission} = useAuth();

    const isDev: boolean = user.maxPermissionLevel === "DEV";

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [changePermissionError, setChangePermissionError] = useState<string | null>(null);
    const [changePermissionSuccess, setChangePermissionSuccess] = useState<boolean>(false);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent): void {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handlePermissionChange(permission: keyof typeof Permission): void {
        setChangePermissionError(null);
        setChangePermissionSuccess(false);

        changePermission(user.username, {newPermission: permission})
            .then(() => {
                setChangePermissionSuccess(true);
                onPermissionChanged(user.username, permission);
            })
            .catch(err => setChangePermissionError(parseAxiosError(err)))
    }

    function selectPermission(permission: keyof typeof Permission): void {
        setDropdownOpen(false);
        handlePermissionChange(permission);
    }

    return (
        <React.Fragment>
            <div className={"userSummaryRow"}>
            <span className={"userSummaryUsername"}>
                {user.username}
            </span>

                <div className={"userSummaryPermissionWrapper"} ref={wrapperRef}>
                    <button
                        type={"button"}
                        className={`userSummaryPermissionBadge ${isDev ? "dev" : "default"}`}
                        onClick={() => {
                            setDropdownOpen(prev => !prev);
                            setChangePermissionError(null);
                            setChangePermissionSuccess(false);
                        }}
                        aria-haspopup={"listbox"}
                        aria-expanded={dropdownOpen}
                    >
                        {user.maxPermissionLevel}
                    </button>

                    {dropdownOpen && (
                        <div className={"userSummaryPermissionDropdown"} role={"listbox"}>
                            {Object.keys(Permission).map(permission => (
                                <div
                                    key={permission}
                                    role={"option"}
                                    aria-selected={permission === user.maxPermissionLevel}
                                    className={`userSummaryPermissionOption ${permission === user.maxPermissionLevel ? "current" : ""}`}
                                    onClick={() => selectPermission(permission as keyof typeof Permission)}
                                >
                                    {permission}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {(changePermissionError || changePermissionSuccess) && (
                <p className={`userSummaryFeedback ${changePermissionError ? "errorText" : "successText"}`}>
                    {changePermissionError ?? "Permission successfully updated."}
                </p>
            )}
        </React.Fragment>
    )
}