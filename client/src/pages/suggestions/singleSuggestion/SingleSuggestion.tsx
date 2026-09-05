import React, {lazy, Suspense, useRef} from 'react';
import type {DeleteSuggestionRequest, Suggestion} from "../../../types/suggestion";
import './singleSuggestion.scss';
import {useAuth} from "../../../context/auth/AuthContext.tsx";
import {Permission} from "../../../types/permission.ts";
import formatDate from "../../../functions/formatDate.ts";

interface SingleSuggestionParams {
    suggestion: Suggestion;
    last?: boolean

    deleteSuggestion: (request: DeleteSuggestionRequest) => Promise<void>;
}

const IconButton = lazy(() => import("../../../components/iconButton/IconButton.tsx"));

export default function SingleSuggestion({suggestion, last, deleteSuggestion}: SingleSuggestionParams): React.ReactElement {

    const {user} = useAuth();
    const deleteAllowed: boolean = (user?.username === suggestion.posterUsername) || (user?.maxPermission === 10);

    const wrapperRef = useRef<HTMLDivElement>(null);

    return (
        <div className={"singleSuggestionWrapper"} ref={wrapperRef}>
            {deleteAllowed && <Suspense>
                <IconButton
                    imageLoader={() => import("../../../assets/images/buttons/delete.svg")}
                    showElementRef={wrapperRef}
                    onClick={() => deleteSuggestion({title: suggestion.title})}
                    alt={"Delete this post button"}
                />
            </Suspense>}
            <span className={`suggestionStatusDot ${suggestion.status}`}/>
            <h2 className={"alignRight"}>
                {suggestion.title}
            </h2>
            <p className={"suggestionPosterInformation alignRight"}>
                Posted by <b>{suggestion.posterUsername}</b> on {formatDate(suggestion.createdAt)}.
            </p>
            <p className={"suggestionDescription alignRight"}>
                {suggestion.description}
            </p>

            {/*the admin response*/}
            <p className={"suggestionAdminResponse alignRight"}>
                {suggestion.adminResponse ? (
                    <React.Fragment>
                        <b>
                            The Admins have responded to this suggestion:
                        </b>
                        "{suggestion.adminResponse}"
                        <br/>
                    </React.Fragment>
                ) : (
                    <b>
                        The Admins haven't responded to this suggestion yet.
                    </b>
                )}
            </p>

            {/*option to update the admin response*/}
            {user?.maxPermission === Permission.DEV && (
                <React.Fragment>
                </React.Fragment>
            )}

            {!last && <div className={"sectionDivider light"} />}
        </div>
    )
}