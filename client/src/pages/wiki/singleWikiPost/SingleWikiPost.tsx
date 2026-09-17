import React, {useState, Suspense, lazy, useRef} from 'react';
import type {WikiPost, WikiSummary, WikiVotingRequest} from "../../../types/wiki";
import {useAuth} from "../../../context/auth/AuthContext.tsx";
import './singleWikiPost.scss';
import formatDate from "../../../functions/formatDate.ts";
import {parseAxiosError} from "../../../functions/parseAxiosError.ts";
import SafeHtml from "../../../components/SafeHtml.tsx";

const IconButton = lazy(() => import("../../../components/iconButton/IconButton.tsx"));

interface SingleWikiPostParams {
    post: WikiSummary;
    loadDetailedPost: () => Promise<WikiPost>;
    voteOnWikiPost: (request: WikiVotingRequest) => Promise<void>;
    deletePost: () => void;
}

export default function SingleWikiPost({post, loadDetailedPost, voteOnWikiPost, deletePost}: SingleWikiPostParams): React.ReactElement {

    const {user} = useAuth();
    const isDev: boolean = user?.maxPermission === 10;

    //has the user already voted on this post
    const alreadyUpvoted: boolean = user?.username != null && post.upvotes.includes(user.username);
    const alreadyDownvoted: boolean = user?.username != null && post.downvotes.includes(user.username);

    const [expanded, setExpanded] = useState<boolean>(false);
    const [detailedPost, setDetailedPost] = useState<WikiPost | null>(null);
    const [loadingExpansion, setLoadingExpansion] = useState<boolean>(false);
    const [expansionError, setExpansionError] = useState<string | null>(null);

    const wrapperRef = useRef<HTMLDivElement>(null);

    async function handleExpand(): Promise<void> {
        const willBeExpanded: boolean = !expanded;
        setExpanded(willBeExpanded);

        if (!willBeExpanded || detailedPost) return;

        try {
            setLoadingExpansion(true);
            setExpansionError(null);
            setDetailedPost(await loadDetailedPost());
        }
        catch (e) {
            setExpansionError(parseAxiosError(e));
        }
        finally {
            setLoadingExpansion(false);
        }
    }

    function handleVote(sign: 1 | -1): void {
        void voteOnWikiPost({title: post.title, sign});
    }

    return (
        <div className={"wikiPostWrapper widget"} ref={wrapperRef}>
            <div className={"wikiPostHeader"}>
                <button
                    className={"expandButton"}
                    type={"button"}
                    onClick={handleExpand}
                >
                    <h2 className={"alignRight"}>
                        {post.title}
                    </h2>
                    <p className={"alignRight smaller"}>
                        Posted by {post.createdBy} on {formatDate(post.createdAt)}.
                    </p>
                </button>

                {/*upvote/downvote*/}
                <div className={"wikiPostVotes"}>
                    <button
                        type={"button"}
                        className={`voteButton upvote ${alreadyUpvoted ? "highlighted" : ""}`}
                        onClick={() => handleVote(1)}
                        aria-label={"Upvote this post"}
                    >
                        <span className={"voteArrow"}>▲</span>
                        <span className={"voteCount"}>{post.upvotes.length}</span>
                    </button>

                    <button
                        type={"button"}
                        className={`voteButton downvote ${alreadyDownvoted ? "highlighted" : ""}`}
                        onClick={() => handleVote(-1)}
                        aria-label={"Downvote this post"}
                    >
                        <span className={"voteArrow"}>▼</span>
                        <span className={"voteCount"}>{post.downvotes.length}</span>
                    </button>
                </div>
            </div>

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