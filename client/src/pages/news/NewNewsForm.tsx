import React, {useState} from 'react';
import type {NewNewsRequest} from "../../types/news";
import FormGroup from "../../components/form/FormGroup.tsx";
import TextareaGroup from "../../components/form/TextareaGroup.tsx";
import FancyButton from "../../components/fancyButton/FancyButton.tsx";
import {parseAxiosError} from "../../functions/parseAxiosError.ts";

interface NewNewsFormParams {
    addNews: (request: NewNewsRequest) => Promise<void>;
}

export default function NewNewsForm({addNews}: NewNewsFormParams): React.ReactElement {

    const [title, setTitle] = useState<string>('');
    const [body, setBody] = useState<string>('');

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

    function handleSubmit(): void {
        setSubmitError(null);
        setSubmitSuccess(false);

        addNews({title, body})
            .then(() => setSubmitSuccess(true))
            .catch(err => setSubmitError(parseAxiosError(err)));
    }

    return (
        <React.Fragment>
            <form style={{maxWidth: '88%', marginLeft: 'auto', marginRight: 'auto'}}>

                <FormGroup
                    name={"title"}
                    value={title}
                    setValue={setTitle}
                    label={"Title"}
                />

                <TextareaGroup
                    label={"Body"}
                    value={body}
                    setValue={setBody}
                    rows={5}
                />
            </form>

            <FancyButton label={"Submit"} onClick={handleSubmit} />
            {submitError && <p className={"errorText"}>{submitError}</p>}
            {submitSuccess && <p className={"successText"}>News successfully added!</p>}
        </React.Fragment>
    )
}