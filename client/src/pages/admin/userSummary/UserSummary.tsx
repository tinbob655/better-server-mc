import React, {useState, useRef, useEffect} from 'react';
import type {UserSummary} from "../../../types/auth";
import './userSummary.scss';
import {Permission} from "../../../types/permission.ts";
import {useAuth} from "../../../context/auth/AuthContext.tsx";
import {parseAxiosError} from "../../../functions/parseAxiosError.ts";
import IconButton from "../../../components/iconButton/IconButton.tsx";

interface UserSummaryParams {
    user: UserSummary;
    onPermissionChanged: (username: string, newPermission: keyof typeof Permission) => void;
    deleteUser: () => void;
}

export default function UserSummary({user, onPermissionChanged, deleteUser}: UserSummaryParams): React.ReactElement {

    const {changePermission, user: clientAccount} = useAuth();

    const isDev: boolean = user.maxPermissionLevel === "DEV";

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const permissionWrapperRef = useRef<HTMLDivElement>(null);
    const summaryWrapperRef = useRef<HTMLDivElement>(null);

    const [changePermissionError, setChangePermissionError] = useState<string | null>(null);
    const [changePermissionSuccess, setChangePermissionSuccess] = useState<boolean>(false);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent): void {
            if (permissionWrapperRef.current && !permissionWrapperRef.current.contains(e.target as Node)) {
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
            <div className={"userSummaryRow"} ref={summaryWrapperRef}>
                <span className={"userSummaryUsername"}>
                    {user.username}
                </span>

                <div className={"userSummaryPermissionWrapper"} ref={permissionWrapperRef}>
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

                <div className={`deleteButtonWrapper ${user.username === clientAccount?.username ? "greyed" : ""}`}>
                    <IconButton
                        imageLoader={() => import("../../../assets/images/buttons/delete.svg")}
                        showElementRef={summaryWrapperRef}
                        onClick={deleteUser}
                    />
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