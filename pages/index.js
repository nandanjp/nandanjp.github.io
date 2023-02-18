import NextLink from 'next/link'
import {
  Link,
  Container,
  Heading,
  Box,
  SimpleGrid,
  Button,
  List,
  ListItem,
  useColorModeValue,
  chakra
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Paragraph from '../components/paragraph'
import { BioSection, BioYear } from '../components/bio'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'
import { IoLogoTwitter, IoLogoInstagram, IoLogoGithub } from 'react-icons/io5'
import Image from 'next/image'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})

const Home = () => (
  <Layout>
    <Container>
      <Box
        borderRadius="lg"
        mb={6}
        p={3}
        textAlign="center"
        bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
        css={{ backdropFilter: 'blur(10px)' }}
      >
        Hello, I'm a keen Software Engineering student at UWaterloo
      </Box>
      <Box display={{ md: 'flex' }}>
        <Box flexGrow={1}>
          <Heading as="h2" variant="page-title">
            Nandan Patel
          </Heading>
          <p>Aspiring Software Engineer in Fullstack and Game dev</p>
        </Box>
        <Box
          flexShrink={0}
          mt={{ base: 4, md: 0 }}
          ml={{ md: 6 }}
          textAlign="center"
        >
          <Box
            borderColor="whiteAlpha.800"
            borderWidth={2}
            borderStyle="solid"
            w="100px"
            h="100px"
            display="inline-block"
            borderRadius="full"
            overflow="hidden"
          >
            <ProfileImage
              src="/images/nandan.jpg"
              className="profile-image"
              alt="Profile Image"
              borderRadius="full"
              width="100%"
              height="100%"
              layout="fill"
            />
          </Box>
        </Box>
      </Box>

      <Section delay={0.1}>
        <Heading as="h3" variant="section-title">
          Work
        </Heading>
        <Paragraph>
          As a first year software engineering student at the University of
          Waterloo, I am constantly challenged to learn new things with the
          hopes of eventually becoming a proficient software developer. With my
          interests mainly living in Game Development, Game Engine Design and
          Front-end development, I am willing to take on whatever roles will
          make my goals achievable.
          {/*<NextLink href="/works/inkdrop" passHref scroll={false}>
            <Link target="_blank">Blog</Link>
</NextLink>*/}
        </Paragraph>
        <Box align="center" my={4}>
          <NextLink href="/works" passHref scroll={false}>
            <Button rightIcon={<ChevronRightIcon />} colorScheme="teal">
              My portfolio
            </Button>
          </NextLink>
        </Box>
      </Section>

      <Section delay={0.2}>
        <Heading as="h3" variant="section-title">
          Bio
        </Heading>
        <BioSection>
          <BioYear>2004</BioYear>
          Born in Toronto, Canada
        </BioSection>
        <BioSection>
          <BioYear>2022</BioYear>
          Received a High School Diploma from Henry Wise Wood High School in
          Calgary, Alberta
        </BioSection>
        <BioSection>
          <BioYear>2022</BioYear>
          Started my first year at the University of Waterloo in their Software
          Engineering programming
        </BioSection>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          My Interests
        </Heading>
        <Paragraph>
          Programming, Mathematics, Sports, Games and Game Development, Learning
          new Skills
        </Paragraph>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          On the Web
        </Heading>
        <List>
          <ListItem>
            <Link href="https://github.com/nandanjp" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<IoLogoGithub />}
              >
                @nandanjp
              </Button>
            </Link>
          </ListItem>
        </List>
        <Box align="center" my={4}>
          <NextLink href="/posts" passHref scroll={false}>
            <Button rightIcon={<ChevronRightIcon />} colorScheme="teal">
              Popular posts
            </Button>
          </NextLink>
        </Box>
      </Section>
    </Container>
  </Layout>
)

export default Home
export { getServerSideProps } from '../components/chakra'
