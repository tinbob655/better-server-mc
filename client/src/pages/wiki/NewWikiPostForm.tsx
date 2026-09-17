import React, {useState} from 'react';
import type {NewWikiPostRequest} from "../../types/wiki";
import FormGroup from "../../components/form/FormGroup.tsx";
import FancyTextareaGroup from "../../components/form/fancyTextareaGroup/FancyTextareaGroup.tsx";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";
import {parseAxiosError} from "../../functions/parseAxiosError.ts";

interface NewWikiPostFormParams {
    addWikiPost: (request: NewWikiPostRequest) => Promise<void>;
}

export default function NewWikiPost({addWikiPost}: NewWikiPostFormParams): React.ReactElement {

    const [title, setTitle] = useState<string>('');
    const [body, setBody] = useState<string>('');

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

    function handleSubmit(): void {
        setSubmitError(null);
        setSubmitSuccess(false);

        const request: NewWikiPostRequest = {title, body};
        addWikiPost(request)
            .then(() => setSubmitSuccess(true))
            .catch(err => setSubmitError(parseAxiosError(err)));
    }

    return (
        <React.Fragment>
            <form>
                <FormGroup
                    name={"title"}
                    label={"Title"}
                    value={title}
                    setValue={setTitle}
                />
                <FancyTextareaGroup
                    label={"Body"}
                    value={body}
                    setValue={setBody}
                />
            </form>

            <FancyButton label={"Submit"} onClick={handleSubmit} />
            {submitError && <p className={"errorText"}>{submitError}</p>}
            {submitSuccess && <p className={"successText"}>Successfully posted!</p>}
        </React.Fragment>
    )
}