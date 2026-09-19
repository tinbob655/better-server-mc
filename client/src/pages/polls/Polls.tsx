import React, {useState, lazy, Suspense} from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/genericMarkupSection/GenericMarkupSection.tsx";
import usePoll from "../../hooks/usePoll.ts";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";
import {useAuth} from "../../context/auth/AuthContext.tsx";
import {Permission} from "../../types/permission.ts";
import SearchBar from "../../components/searchBar/SearchBar.tsx";
import useSearch from "../../hooks/useSearch.ts";

const SinglePoll = lazy(() => import("./singlePoll/SinglePoll.tsx"));
const NewPollForm = lazy(() => import("./newPollForm/NewPollForm.tsx"));

export default function Polls():React.ReactElement {

    const {
        pollSummaries,
        fetchError,

        getAllPolls,
        getDetailedPoll,

        addPoll,

        deletePoll,
        deletePollOption,

        voteFor,
    } = usePoll();

    const {user} = useAuth();
    const isDev: boolean = user?.maxPermission === Permission.DEV;

    const {search, setSearch, filteredItems} = useSearch(pollSummaries, p => [p.title]);

    const [showAllPolls, setShowAllPolls] = useState<boolean>(false);
    const [creatingNewPoll, setCreatingNewPoll] = useState<boolean>(false);

    function toggleShowAllPolls(): void {
        if (!showAllPolls) {
            getAllPolls();
            setShowAllPolls(true);
        }
    }

    return (
        <React.Fragment>
            <PageHeader title={"Polls"} subtitle={"Vote on server policy"} />

            <GenericMarkupSection title={"Ongoing polls"}>
                <p>
                    Please take a look at our polls. To vote in a poll, you will need to be logged into your
                    Better Server account.
                </p>
                {fetchError && <p className={"errorText"}>{fetchError}</p>}
                {!showAllPolls && (
                    <React.Fragment>
                        <p className={"warningText"}>
                            Only showing ongoing polls at the moment.
                        </p>
                        <div style={{marginBottom: '2rem'}}>

                            <FancyButton
                                label={"Click here to show all polls instead"}
                                onClick={toggleShowAllPolls}
                                alignment={"RIGHT"}
                            />
                        </div>
                    </React.Fragment>
                )}
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder={"Search polls..."}
                    alignment={"RIGHT"}
                />
                <div className={"sectionDivider light"} />

                {pollSummaries.length === 0 && <p className={"warningText"}>There are currently no polls available</p>}
                {pollSummaries.length > 0 && filteredItems.length === 0 && <p className={"warningText"}>No polls for that search</p>}
                {filteredItems.map(p =>
                    <Suspense>
                        <SinglePoll
                            key={p.title}
                            pollSummary={p}
                            getDetailedPoll={() => getDetailedPoll(p.title)}
                            voteFor={voteFor}
                            deletePoll={() => deletePoll(p.title)}
                            deletePollOption={deletePollOption}
                        />
                    </Suspense>
                )}
            </GenericMarkupSection>

            {/*allow devs to add new polls*/}
            {isDev && <GenericMarkupSection title={"Add a new poll"} left>
                <p>
                    You are a dev which means you are able to create new polls. Click below if you wish to do so.
                    <br/>
                    Note that after a poll is created, it can only be deleted, not modified. This is to prevent poll
                    spoofing.
                </p>
                <FancyButton label={"Create a poll"} onClick={() => setCreatingNewPoll(prev => !prev)} />

                {creatingNewPoll && (
                    <Suspense>
                        <NewPollForm
                            addPoll={addPoll}
                        />
                    </Suspense>
                )}
            </GenericMarkupSection>}
        </React.Fragment>
    )
}