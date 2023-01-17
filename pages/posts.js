import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'

import thumbPortfolio from '../public/images/contents/youtube-how-to-build-portfolio.jpg'
import thumbHotToUseInkdrop from '../public/images/contents/youtube-how-to-use-inkdrop.jpg'
import thumbFishWorkflow from '../public/images/contents/youtube-fish-workflow.jpg'
import thumbMyDeskSetup from '../public/images/contents/youtube-my-desk-setup.jpg'
import thumb500PaidUsers from '../public/images/contents/blog-500-paid-users.jpg'
import thumbFinancialGoal from '../public/images/contents/blog-financial-goal.png'
import thumbHowToPriceYourself from '../public/images/contents/blog-how-to-price-yourself.jpg'
import thumb50xFaster from '../public/images/contents/youtube-50x-faster.jpg'

import thumbBlogSite from '../public/images/works/blog-site.jpg'
import thumbNatoursSite from '../public/images/works/natours-app.jpg'
import thumbAdminPanel from '../public/images/works/admin-app.jpg'

const Posts = () => (
  <Layout title="Posts">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Popular Posts
      </Heading>

      <Section delay={0.1}>
        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          <GridItem
            title="How to be an Admin - Admin Control"
            thumbnail={thumbAdminPanel}
            href="https://github.com/nandanjp/Admin-Analytics"
          />
          <GridItem
            title="Natours - AllTrails like Website to make you fall in love with Nature"
            thumbnail={thumbNatoursSite}
            href="https://github.com/nandanjp/Natours"
          />
          <GridItem
            title="Flexing CSS and SASS"
            thumbnail={thumbBlogSite}
            href="https://github.com/nandanjp/Flexing-CSS"
          />
        </SimpleGrid>
      </Section>
    </Container>
  </Layout>
)

export default Posts
export { getServerSideProps } from '../components/chakra'
