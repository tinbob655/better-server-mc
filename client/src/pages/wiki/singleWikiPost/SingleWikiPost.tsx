import React, {useState, Suspense, lazy, useRef} from 'react';
import type {WikiPost, WikiSummary} from "../../../types/wiki";
import {useAuth} from "../../../context/auth/AuthContext.tsx";
import './singleWikiPost.scss';
import formatDate from "../../../functions/formatDate.ts";
import {parseAxiosError} from "../../../functions/parseAxiosError.ts";
import SafeHtml from "../../../components/SafeHtml.tsx";

const IconButton = lazy(() => import("../../../components/iconButton/IconButton.tsx"));

interface SingleWikiPostParams {
    post: WikiSummary;
    loadDetailedPost: () => Promise<WikiPost>;
    deletePost: () => void;
}

export default function SingleWikiPost({post, loadDetailedPost, deletePost}: SingleWikiPostParams): React.ReactElement {

    const {user} = useAuth();
    const isDev: boolean = user?.maxPermission === 10;

    const [expanded, setExpanded] = useState<boolean>(false);
    const [detailedPost, setDetailedPost] = useState<WikiPost | null>(null);
    const [loadingExpansion, setLoadingExpansion] = useState<boolean>(false);
    const [expansionError, setExpansionError] = useState<string | null>(null);

    const wrapperRef = useRef<HTMLDivElement>(null);

    async function handleExpand(): Promise<void> {
        try {
            setExpanded(prev => !prev);

            if (expanded && !detailedPost) {
                setLoadingExpansion(true);
                const bigPost = await loadDetailedPost();
                setDetailedPost(bigPost);
                setLoadingExpansion(false);
                setExpansionError(null);
            }
        }
        catch (e) {
            setExpansionError(parseAxiosError(e));
        }
    }

    return (
        <div className={"wikiPostWrapper"} ref={wrapperRef}>
            <button
                className={"expandButton"}
                    type={"button"}
                    onClick={handleExpand}
            >
                <h2 className={"alignRight"}>
                    {post.title}
                </h2>
                <p className={"alignRight smaller"}>
                    Posted by {post.createdBy} at {formatDate(post.createdAt)}.
                </p>
                {/*TODO: DISPLAY UPVOTES AND DOWNVOTES HERE*/}
            </button>

            {expanded && (
                <React.Fragment>
                    {expansionError && <p className={"errorText"}>{expansionError}</p>}
                    {loadingExpansion && <p className={"alignRight"}>Loading wiki entry...</p>}
                    {isDev && (
                        <Suspense>
                            <IconButton
                                imageLoader={() => import("../../../assets/images/buttons/delete.svg")}
                                showElementRef={wrapperRef}
                                onClick={deletePost}
                            />
                        </Suspense>
                    )}
                    {detailedPost && (
                        <SafeHtml html={detailedPost.body} className={"alignRight"} />
                    )}
                </React.Fragment>
            )}
        </div>
    )
}