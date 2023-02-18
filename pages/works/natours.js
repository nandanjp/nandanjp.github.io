import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  AspectRatio
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Work = () => (
  <Layout title="Natours">
    <Container>
      <Title>
        Natours <Badge>2020-</Badge>
      </Title>
      <P>A full-stack e-commerce site all about Nature and its beauty :/</P>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Website</Meta>
          <Link href="https://github.com/nandanjp/Natours">
            https://github.com/nandanjp/Natours <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Windows/macOS/Linux/iOS/Android</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>NodeJS, Express, MongoDB</span>
        </ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
