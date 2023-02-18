import NextLink from 'next/link'
import {
  Box,
  Heading,
  Text,
  Container,
  Divider,
  Button
} from '@chakra-ui/react'

const WorkInProgress = () => {
  return (
    <Container>
      <Heading as="h1">
        I know you were intrigued by what this was about.....
      </Heading>
      <Text>
        I apologize... This is but a work in progress as I release a more
        tailored application for this... Look forward to a Review/Analysis for
        what you clicked in the future either here or on my blog {':)'}
      </Text>
      <Divider my={6} />
      <Box my={6} align="center">
        <NextLink href="/" passHref>
          <Button colorScheme="teal">Return to home</Button>
        </NextLink>
      </Box>
    </Container>
  )
}

export default WorkInProgress
