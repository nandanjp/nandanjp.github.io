import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'
import NextLink from 'next/link'

import thumbResume from '../public/images/resume.jpeg'

const Posts = () => (
  <Layout title="Resume">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Resume
      </Heading>

      <Section delay={0.1}>
        <SimpleGrid columns={[1]} gap={6}>
          <NextLink
            href="https://github.com/nandanjp/resume/blob/main/resume.pdf"
            passHref
          >
            <GridItem
              title="My Resume"
              thumbnail={thumbResume}
              href="https://github.com/nandanjp/resume/blob/main/resume.pdf"
            />
          </NextLink>
        </SimpleGrid>
      </Section>
    </Container>
  </Layout>
)

export default Posts
export { getServerSideProps } from '../components/chakra'
