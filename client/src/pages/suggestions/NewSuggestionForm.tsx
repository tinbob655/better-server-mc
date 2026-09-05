import React, {useState} from 'react';
import type {NewSuggestionRequest} from "../../types/suggestion";
import FormGroup from "../../components/form/FormGroup.tsx";
import {parseAxiosError} from "../../functions/parseAxiosError.ts";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";
import TextareaGroup from "../../components/form/TextareaGroup.tsx";

interface NewSuggestionFormParams {
    addSuggestion: (request: NewSuggestionRequest) => Promise<void>;
}

export default function NewSuggestionForm({addSuggestion}: NewSuggestionFormParams): React.ReactElement {

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [submitError, setSubmitError] = useState<string|null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

    function handleSubmit(): void {
        setSubmitError(null);
        setSubmitSuccess(false);

        addSuggestion({title, description})
            .then(() => setSubmitSuccess(true))
            .catch(err => setSubmitError(parseAxiosError(err)))
    }

    return (
        <React.Fragment>
            <form className={"horizontal"}>

                <FormGroup
                    name={"title"}
                    value={title}
                    setValue={setTitle}
                    label={"Title"}
                />

                <TextareaGroup
                    label={"Description"}
                    value={description}
                    setValue={setDescription}
                    rows={5}
                />
            </form>
            <FancyButton label={"Submit suggestion"} onClick={handleSubmit} />

            {submitError && <p className={"errorText"}>{submitError}</p>}
            {submitSuccess && <p className={"successText"}>Suggestion successfully submitted!</p>}
        </React.Fragment>
    )
}