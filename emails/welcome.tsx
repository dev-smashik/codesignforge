/**
 * Branded welcome email for new waitlist subscribers (React Email).
 *
 * Rendered server-side on every send — never link temporary asset URLs.
 * All styling is inline (email-client safe). No verification claims are
 * made: the recipient explicitly opted in to launch updates.
 */
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { SITE } from "@/lib/site";

interface WelcomeEmailProps {
  appUrl: string;
  unsubscribeUrl: string;
}

export function WelcomeEmail({ appUrl, unsubscribeUrl }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        You&apos;re on the CoDesign Forge launch waitlist — here&apos;s what
        happens next.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={`${appUrl}/landing/brand-mark.svg`}
              alt=""
              width={36}
              height={36}
              style={logo}
            />
            <Text style={wordmark}>{SITE.name}</Text>
          </Section>

          <Heading style={heading}>You&apos;re on the list.</Heading>

          <Text style={paragraph}>
            Thanks for joining the {SITE.name} website launch waitlist. You
            asked to receive launch updates, and we&apos;ll only email you
            about the launch and early access — no noise, no third parties.
          </Text>

          <Text style={paragraph}>What happens next:</Text>
          <Text style={paragraphList}>
            1. We&apos;ll send your early-access invite as soon as we open the
            doors.
            <br />
            2. Launch updates will arrive here, from this same address.
            <br />
            3. You can unsubscribe at any time — one click, no questions.
          </Text>

          <Text style={paragraph}>
            See you at launch.
            <br />— The {SITE.name} team
          </Text>

          <Section style={footer}>
            <Link href={appUrl} style={footerLink}>
              {appUrl}
            </Link>
            {" · "}
            <Link href={unsubscribeUrl} style={footerLink}>
              Unsubscribe
            </Link>
            <Text style={legal}>
              You received this because you asked for {SITE.name} launch
              updates. We only email subscribers who opt in — no reply needed.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// -- Inline styles (email-client safe) ---------------------------------------

const body: React.CSSProperties = {
  backgroundColor: "#101010",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
  margin: "0",
  padding: "0",
};

const container: React.CSSProperties = {
  backgroundColor: "#101010",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "32px 24px",
};

const header: React.CSSProperties = {
  textAlign: "center",
};

const logo: React.CSSProperties = {
  display: "inline-block",
  verticalAlign: "middle",
};

const wordmark: React.CSSProperties = {
  color: "#ffffff",
  display: "inline-block",
  fontSize: "22px",
  fontWeight: 600,
  letterSpacing: "-0.012em",
  margin: "0 0 0 10px",
  verticalAlign: "middle",
};

const heading: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: 500,
  letterSpacing: "-0.02em",
  lineHeight: "1.15",
  margin: "28px 0 16px",
  textAlign: "center",
};

const paragraph: React.CSSProperties = {
  color: "#fafafa",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 16px",
};

const paragraphList: React.CSSProperties = {
  color: "#fafafa",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const footer: React.CSSProperties = {
  borderTop: "1px solid #2e2e2e",
  marginTop: "32px",
  paddingTop: "20px",
  textAlign: "center",
};

const footerLink: React.CSSProperties = {
  color: "#919191",
  fontSize: "13px",
  textDecoration: "underline",
};

const legal: React.CSSProperties = {
  color: "#5f5f5f",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "12px 0 0",
};
