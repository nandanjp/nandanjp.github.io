import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Tailwind,
    Text,
} from "@react-email/components";

interface ContactEmailProps {
    senderEmail: string;
    inviteFromIp: string | null;
}

export const ContactedByEmail = ({
    senderEmail,
    inviteFromIp,
}: ContactEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Contacted by {senderEmail}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Contacted by <strong>{senderEmail}</strong>
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello nandan,
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            <Link
                                href={`mailto:${senderEmail}`}
                                className="text-blue-600 no-underline"
                            >
                                <strong>{senderEmail}</strong>
                            </Link>{" "}
                            has sent you an email, and so you should contact
                            them whenever you&apos;re free!
                        </Text>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            This invitation was intended for{" "}
                            <span className="text-black">nandan</span>.{" "}
                            {inviteFromIp && (
                                <>
                                    This invite was sent from{" "}
                                    <span className="text-black">
                                        {inviteFromIp}
                                    </span>
                                    .
                                </>
                            )}
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ContactedByEmail;
