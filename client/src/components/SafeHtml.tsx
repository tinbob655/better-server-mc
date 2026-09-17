import React, {useMemo} from 'react';
import DOMPurify from 'dompurify';

interface SafeHtmlParams extends Omit<React.ComponentProps<'div'>, 'dangerouslySetInnerHTML'> {
    html: string;
}

const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'blockquote', 'a'];
const ALLOWED_ATTR = ['href'];

//matches an opening HTML tag e.g. "<p>" or "<strong>". Deliberately does NOT
//match things like "1 < 2" (no letter immediately after <) or an escaped "&lt;b&gt;"
const HTML_TAG_PATTERN = /<[a-z][\s\S]*>/i;

export default function SafeHtml({html, ...props}: SafeHtmlParams): React.ReactElement {

    const clean: string = useMemo(
        () => DOMPurify.sanitize(html, {ALLOWED_TAGS, ALLOWED_ATTR}),
        [html]
    );

    //don't need to format plain text, just wrap it in a <p>
    const isPlainText: boolean = useMemo(() => !HTML_TAG_PATTERN.test(clean.trim()), [clean]);

    return isPlainText
        ? <p {...props} dangerouslySetInnerHTML={{__html: clean}} />
        : <div {...props} dangerouslySetInnerHTML={{__html: clean}} />;
}