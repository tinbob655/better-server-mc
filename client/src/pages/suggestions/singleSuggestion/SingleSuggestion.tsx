import React, {lazy, Suspense, useRef, useState, useEffect} from 'react';
import type {
    ChangeAdminResponseRequest,
    ChangeStatusRequest,
    DeleteSuggestionRequest,
    Suggestion,
    SuggestionStatus
} from "../../../types/suggestion";
import './singleSuggestion.scss';
import {useAuth} from "../../../context/auth/AuthContext.tsx";
import {Permission} from "../../../types/permission.ts";
import formatDate from "../../../functions/formatDate.ts";
import TextareaGroup from "../../../components/form/TextareaGroup.tsx";
import FancyButton from "../../../components/fancyButton/FancyButton.tsx";
import {parseAxiosError} from "../../../functions/parseAxiosError.ts";

interface SingleSuggestionParams {
    suggestion: Suggestion;

    deleteSuggestion: (request: DeleteSuggestionRequest) => Promise<void>;
    changeSuggestionAdminResponse: (request: ChangeAdminResponseRequest) => Promise<void>;
    changeSuggestionStatus: (request: ChangeStatusRequest) => Promise<void>;
}

//maps status code to readable labels
const STATUS_LABELS: Record<SuggestionStatus, string> = {
    UNSEEN: "Pending review",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
    CLOSED: "Closed",
};

const IconButton = lazy(() => import("../../../components/iconButton/IconButton.tsx"));

export default function SingleSuggestion({
                                             suggestion,
                                             deleteSuggestion,
                                             changeSuggestionAdminResponse,
                                             changeSuggestionStatus,
}: SingleSuggestionParams): React.ReactElement {

    const {user} = useAuth();
    const isDev: boolean = user?.maxPermission === Permission.DEV;
    const deleteAllowed: boolean = (user?.username === suggestion.posterUsername) || isDev;

    const wrapperRef = useRef<HTMLDivElement>(null);

    //stuff for changing the admin response
    const [isRespondingTo, setIsRespondingTo] = useState<boolean>(false);
    const [responseDraft, setResponseDraft] = useState<string>(suggestion.adminResponse ?? '');
    const [isSubmittingResponse, setIsSubmittingResponse] = useState<boolean>(false);
    const [responseError, setResponseError] = useState<string | null>(null);

    function openResponseForm(): void {
        setResponseDraft(suggestion.adminResponse ?? '');
        setResponseError(null);
        setIsRespondingTo(true);
    }

    function handleSubmitResponse(): void {
        setIsSubmittingResponse(true);
        setResponseError(null);

        changeSuggestionAdminResponse({suggestionTitle: suggestion.title, adminResponse: responseDraft})
            .then(() => setIsRespondingTo(false))
            .catch(err => setResponseError(parseAxiosError(err)))
            .finally(() => setIsSubmittingResponse(false));
    }

    //stuff for changing the status
    const [statusDropdownOpen, setStatusDropdownOpen] = useState<boolean>(false);
    const [statusChangeError, setStatusChangeError] = useState<string | null>(null);
    const statusWrapperRef = useRef<HTMLSpanElement>(null);

    //add a listener to close the dropdown when the user clicks off it
    useEffect(() => {
        function handleClickOutside(e: MouseEvent): void {
            if (statusWrapperRef.current && !statusWrapperRef.current.contains(e.target as Node)) {
                setStatusDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    })

    function selectStatus(status: SuggestionStatus): void {
        setStatusDropdownOpen(false);
        if (status === suggestion.status) return;

        setStatusChangeError(null);
        changeSuggestionStatus({suggestionTitle: suggestion.title, newStatus: status})
            .catch(err => setStatusChangeError(parseAxiosError(err)));
    }

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

            <h2 className={"alignRight"}>
                <span className={"suggestionStatusWrapper"} ref={statusWrapperRef}>
                    {isDev ? (
                        <React.Fragment>
                            <button
                                type={"button"}
                                className={`suggestionStatusBadge ${suggestion.status}`}
                                onClick={() => setStatusDropdownOpen(prev => !prev)}
                                aria-haspopup={"listbox"}
                                aria-expanded={statusDropdownOpen}
                            >
                                {STATUS_LABELS[suggestion.status]}
                                {statusDropdownOpen && (
                                    <div className={"suggestionStatusDropdown"} role={"listbox"}>
                                        {(Object.keys(STATUS_LABELS) as SuggestionStatus[]).map(status => (
                                            <div
                                                key={status}
                                                role={"option"}
                                                aria-selected={status === suggestion.status}
                                                className={`suggestionStatusOption ${status} ${status === suggestion.status ? "current" : ""}`}
                                                onClick={() => selectStatus(status)}
                                            >
                                                {STATUS_LABELS[status]}
                                          </div>
                                       ))}
                                   </div>
                                )}
                            </button>
                        </React.Fragment>
                    ) : (
                        <span className={`suggestionStatusBadge ${suggestion.status}`}>
                            {STATUS_LABELS[suggestion.status]}
                        </span>
                    )}
                </span>
                {suggestion.title}
            </h2>
            {statusChangeError && <p className={"errorText"}>{statusChangeError}</p>}
            <p className={"suggestionPosterInformation alignRight"}>
                Posted by <b>{suggestion.posterUsername}</b> on {formatDate(suggestion.createdAt)}.
            </p>
            <p className={"suggestionDescription alignRight"}>
                {suggestion.description}
            </p>

            {/*hide the read-only response while the edit form is open because only want one copy on the screen*/}
            {!isRespondingTo && (
                <p className={`suggestionAdminResponse alignRight ${suggestion.adminResponse ? "hasResponse" : ""}`}>
                    {suggestion.adminResponse ? (
                        <React.Fragment>
                            <b>The Admins have responded to this suggestion:</b>
                            "{suggestion.adminResponse}"
                        </React.Fragment>
                    ) : (
                        <b>The Admins haven't responded to this suggestion yet.</b>
                    )}
                </p>
            )}

            {/*lets a dev add or edit the admin response*/}
            {isDev && (
                isRespondingTo ? (
                    <div className={"suggestionAdminResponseForm"}>
                        <TextareaGroup
                            label={"Admin response"}
                            value={responseDraft}
                            setValue={setResponseDraft}
                            rows={3}
                        />
                        <div className={"suggestionAdminResponseFormActions"}>
                            <FancyButton
                                label={"Save response"}
                                onClick={handleSubmitResponse}
                                disabled={isSubmittingResponse || responseDraft.trim().length === 0}
                            />
                            <FancyButton
                                label={"Cancel"}
                                onClick={() => setIsRespondingTo(false)}
                                disabled={isSubmittingResponse}
                            />
                        </div>
                        {responseError && <p className={"errorText"}>{responseError}</p>}
                    </div>
                ) : (
                    <FancyButton
                        label={suggestion.adminResponse ? "Edit response" : "Respond to this suggestion"}
                        onClick={openResponseForm}
                    />
                )
            )}
        </div>
    )
}