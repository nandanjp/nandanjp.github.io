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
  <Layout title="Nandan's Media">
    <Container>
      <Title>
        Nandan's Media <Badge>2023-</Badge>
      </Title>
      <P>
        A very, very, VERY work in progress blog site that will be updated with
        reviews on different kinds of media that I have had the luxury of
        consuming over the years! Look forward to updates and analyses that are
        to come soon...
      </P>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Website</Meta>
          <Link href="https://github.com/nandanjp/personal-blog">
            https://github.com/nandanjp/personal-blog{' '}
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Windows/macOS/Linux/iOS/Android</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>
            NodeJS, React, Express, MongoDB {'(Possibly switching to Asp.Net)'}
          </span>
        </ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
