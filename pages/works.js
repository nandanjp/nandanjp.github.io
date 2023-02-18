import { Container, Heading, SimpleGrid, Divider } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'

import thumbBlogSite from '../public/images/works/blog-site.jpg'
import thumbNatoursSite from '../public/images/works/natours-app.jpg'
import thumbAdminPanel from '../public/images/works/admin-app.jpg'

const Works = () => (
  <Layout title="Works">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Works
      </Heading>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section>
          <WorkGridItem
            id="admin"
            title="Admin Control"
            thumbnail={thumbAdminPanel}
          >
            A FullStack Web App built using the MERN stack, complete with many
            features typical of that found in a modern admin panel.
          </WorkGridItem>
        </Section>
      </SimpleGrid>

      <Section delay={0.4}>
        <Divider my={6} />
        <Heading as="h3" fontSize={20} mb={4}>
          Old works
        </Heading>
      </Section>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section delay={0.5}>
          <WorkGridItem
            id="natours"
            thumbnail={thumbNatoursSite}
            title="Natours"
          >
            A full-stack application made in vanilla javascript, complete with
            an express backend framework, a custom REST API that utilizes CRUD
            operations to communicate with a MongoDB server.
          </WorkGridItem>
        </Section>
        <Section delay={0.5}>
          <WorkGridItem
            id="blog"
            thumbnail={thumbBlogSite}
            title="Nandan's Thoughts - Personal Blog"
          >
            A personal blog site created use Next.js and TailwindCSS. The blogs
            were created to express my reviews of various media.
          </WorkGridItem>
        </Section>
      </SimpleGrid>
    </Container>
  </Layout>
)

export default Works
export { getServerSideProps } from '../components/chakra'
