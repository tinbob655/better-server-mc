import React, {useState, Suspense, useEffect, lazy} from 'react';
import {useAuth} from "../../context/auth/AuthContext.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/genericMarkupSection/GenericMarkupSection.tsx";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";
import {useNavigate} from "react-router";
import axiosInstance from "../../axiosInstance.ts";
import type {UserSummary} from "../../types/auth";
import type {AxiosResponse} from "axios";
import type {Permission} from "../../types/permission.ts";

const UserSummary = lazy(() => import("./userSummary/UserSummary.tsx"));

export default function Admin(): React.ReactElement {

    const navigate = useNavigate();

    const {user} = useAuth();
    const isDev: boolean = user?.maxPermission === 10;

    const [showUserAccounts, setShowUserAccounts] = useState<boolean>(false);
    const [allUsers, setAllUsers] = useState<UserSummary[]>([]);

    //get all user accounts when the user requests them
    useEffect(() => {

        //return if not showing
        if (!showUserAccounts) return;

        axiosInstance.get("/auth/allUsers")
            .then((res: AxiosResponse<UserSummary[]>) => setAllUsers(res.data))
    }, [showUserAccounts])

    //will fire when the user changes the permission of an account
    function handleUserPermissionChanged(username: string, newPermission: keyof typeof Permission): void {
        setAllUsers(prev => prev.map(u =>
            u.username === username ? {...u, maxPermissionLevel: newPermission} : u
        ));
    }

    //only show the page to devs
    if (isDev) return (
        <React.Fragment>
            <PageHeader title={"Admin"} subtitle={"You have been given the power"} />

            {/*view & edit user accounts section*/}
            <GenericMarkupSection title={"User accounts"}>
                <p>
                    Each user account can be a different permission level, please use the below form to edit these user
                    permission levels. Remember that giving a user 'DEV' permissions means they have full reign over the
                    webapp.
                </p>
                <FancyButton
                    label={"View & edit user permission levels"}
                    onClick={() => setShowUserAccounts(prev => !prev)}
                />
                <Suspense>
                    {showUserAccounts && allUsers.map(summary => (
                        <UserSummary
                            user={summary}
                            key={summary.username}
                            onPermissionChanged={handleUserPermissionChanged}
                        />
                    ))}
                </Suspense>
            </GenericMarkupSection>
        </React.Fragment>
    )

    else return (
        <React.Fragment>
            <PageHeader title={"Restricted"} subtitle={"You're on restricted turf and we recommend turning around"} />

            <GenericMarkupSection title={"Access denied"}>
                <p>
                    You are not allowed access to this page. If you think you should be allowed access then please get
                    in touch with <b>Tinbob655</b>. Otherwise please return to safety.
                </p>
                <FancyButton label={"Return to safety"} onClick={() => navigate(-1)} />
            </GenericMarkupSection>
        </React.Fragment>
    )
}