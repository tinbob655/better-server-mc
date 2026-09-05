import React, {lazy, Suspense, useState} from 'react';
import PageHeader from "../../components/PageHeader.tsx";
import GenericMarkupSection from "../../components/genericMarkupSection/GenericMarkupSection.tsx";
import useSuggestion from "../../hooks/useSuggestion.ts";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";
import type {Suggestion} from "../../types/suggestion"

const SingleSuggestion = lazy(() => import("./singleSuggestion/SingleSuggestion.tsx"));
const NewSuggestionForm = lazy(() => import("./NewSuggestionForm.tsx"));

export default function Suggestions(): React.ReactElement {

    const {
        suggestions,
        fetchError,
        getAllSuggestions,
        addSuggestion,
        deleteSuggestion,
        changeSuggestionAdminResponse,
        changeSuggestionStatus,
    } = useSuggestion();

    const [showingAll, setShowingAll] = useState<boolean>(false);
    const [makingNewSuggestion, setMakingNewSuggestion] = useState<boolean>(false);

    return (
        <React.Fragment>
            <PageHeader title={"Suggestions"} subtitle={"Post suggestions straight to the server admins"} />

            <GenericMarkupSection title={"What you've been saying"}>
                <p>
                    On this page you can view a list of suggestions made by you, our players. The admins read every suggestion
                    you post and take time considering whether to follow through on them or not.
                </p>
                {!showingAll &&
                    <React.Fragment>
                        <p className={"warningText"} style={{fontWeight: 100}}>
                            NOTE: currently showing suggestions which are in progress
                        </p>
                        <FancyButton label={"Click here to show all suggestions instead"} onClick={() => {
                            getAllSuggestions()
                                .then(() => setShowingAll(true));
                        }} />
                    </React.Fragment>
                }

                {fetchError && <p className={"errorText"}>Failed to get suggestions: {fetchError}</p>}
                <Suspense>
                    <div style={{marginTop: '1rem'}}>
                        {suggestions.map((suggestion: Suggestion): React.ReactElement =>
                            <SingleSuggestion
                                suggestion={suggestion}
                                key={suggestion.title}

                                deleteSuggestion={deleteSuggestion}
                                changeSuggestionAdminResponse={changeSuggestionAdminResponse}
                                changeSuggestionStatus={changeSuggestionStatus}
                            />
                        )}
                    </div>
                </Suspense>
            </GenericMarkupSection>


            {/*make a new suggestion section*/}
            <GenericMarkupSection title={"Get heard"}>
                <p>
                    We understand its important for your voice to be heard: to make a suggestion just use the form below.
                    Please try to keep the titles of suggestions short for easier reading. The admins will try to respond
                    to your suggestion as quickly as they can, rest assured they will be notified when the suggestion is
                    made.
                </p>
                <FancyButton label={"Make your suggestion"} onClick={() => setMakingNewSuggestion(prev => !prev)} />
                <Suspense>
                    {makingNewSuggestion && <NewSuggestionForm addSuggestion={addSuggestion} />}
                </Suspense>
            </GenericMarkupSection>
        </React.Fragment>
    )
}