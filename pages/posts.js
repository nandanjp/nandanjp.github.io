import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'
import NextLink from 'next/link'

import thumbChainsawMan from '../public/images/contents/chainsaw-man.jpeg'
import thumbDrama from '../public/images/contents/drama.jpeg'
import thumbHaikyu from '../public/images/contents/haikyuu.jpeg'
import thumbJujutsu from '../public/images/contents/jujutsu-kaisen.jpeg'
import thumbNierAutomata from '../public/images/contents/nier-automata.jpeg'
import thumbPokemon from '../public/images/contents/pokemon.jpeg'

const Posts = () => (
  <Layout title="Posts">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Popular Posts
      </Heading>

      <Section delay={0.1}>
        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          <NextLink href="/progress" passHref>
            <GridItem
              title="Chainsaw Man - A Devillish Guise"
              thumbnail={thumbChainsawMan}
              href="/progress"
            />
          </NextLink>
          <NextLink href="/progress" passHref>
            <GridItem
              title="It's Okay to Not be Okay - Need I say more?"
              thumbnail={thumbDrama}
              href="/progress"
            />
          </NextLink>
          <NextLink href="/progress" passHref>
            <GridItem
              title="An Exploration into Anime, Life and the Game"
              thumbnail={thumbHaikyu}
              href="/progress"
            />
          </NextLink>
          <NextLink href="/progress" passHref>
            <GridItem
              title="The Element of the Unknown - Jujutsu Kaisen"
              thumbnail={thumbJujutsu}
              href="/progress"
            />
          </NextLink>
        </SimpleGrid>
      </Section>

      <Section delay={0.3}>
        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          <GridItem
            title="Nothing but a game.... How so how philosophically incompetently said"
            thumbnail={thumbNierAutomata}
            href="/progress"
          />
          <GridItem
            title="Nostalgic - Need I Say More. A look into the simplicity of games"
            thumbnail={thumbPokemon}
            href="/progress"
          />
        </SimpleGrid>
      </Section>
    </Container>
  </Layout>
)

export default Posts
export { getServerSideProps } from '../components/chakra'
