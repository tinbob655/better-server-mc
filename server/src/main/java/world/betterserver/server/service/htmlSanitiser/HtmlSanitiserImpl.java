package world.betterserver.server.service.htmlSanitiser;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.stereotype.Service;

@Service
public class HtmlSanitiserImpl implements HtmlSanitiserService {


    @Override
    public String sanitise(String rawHTML) {
        return rawHTML == null ? null : this.policy.sanitize(rawHTML);
    }

    private final PolicyFactory policy = new HtmlPolicyBuilder()

            //don't add more elements without checking documentation first as it could open up vulnerabilities
            .allowElements("p", "br", "strong", "em", "u", "ol", "ul", "li", "blockquote", "a")
            .allowAttributes("href").onElements("a")
            .allowStandardUrlProtocols()
            .requireRelNofollowOnLinks() //stops submitted links passing SEO trust / boosting their own site
            .toFactory();
}
