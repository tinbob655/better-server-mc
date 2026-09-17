import React, {lazy, Suspense, useState} from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/genericMarkupSection/GenericMarkupSection.tsx";
import useWiki from "../../hooks/useWiki.ts";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";

const  SingleWikiPost = lazy(() => import("./singleWikiPost/SingleWikiPost.tsx"));
const NewWikiPostForm = lazy(() => import("./NewWikiPostForm.tsx"));

export default function Wiki(): React.ReactElement {

    const {
        summaries,
        fetchError,
        getDetailedPost,
        addWikiPost,
        voteOnWikiPost,
        deleteWikiPost
    } = useWiki();

    const [postingNew, setPostingNew] = useState<boolean>(false);

    return (
        <React.Fragment>
            <PageHeader title={"Wiki"} subtitle={"Find out more about the server!"} />

            {/*wiki posts list*/}
            <GenericMarkupSection title={"Read all about it"}>
                <p>
                    Here is a list of wiki posts our community has made! To read more on a post, just click on it. Further
                    down the page you will be able to make posts of your own.
                </p>
                {fetchError && <p className={"errorText"}>{fetchError}</p>}
                {summaries.map(summary => (
                    <Suspense>
                        <SingleWikiPost
                            key={summary.title}
                            post={summary}
                            loadDetailedPost={() => getDetailedPost({title: summary.title})}
                            voteOnWikiPost={voteOnWikiPost}
                            deletePost={() => deleteWikiPost({title: summary.title})}
                        />
                    </Suspense>
                ))}
            </GenericMarkupSection>

            {/*add a post section*/}
            <GenericMarkupSection title={"Post to the wiki"} left>
                <p>
                    As a player of the Better Server, you are eligible to make more wiki posts! You'll need to be logged
                    in to your Better Server account first though.
                </p>
                <FancyButton label={"Click here to post!"} onClick={() => setPostingNew(prev => !prev)} />
                {postingNew && (
                    <Suspense>
                        <NewWikiPostForm
                            addWikiPost={addWikiPost}
                        />
                    </Suspense>
                )}
            </GenericMarkupSection>
        </React.Fragment>
    )
}