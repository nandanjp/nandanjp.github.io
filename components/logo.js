import Link from 'next/link'
import { Text, useColorModeValue } from '@chakra-ui/react'
import styled from '@emotion/styled'
import PenIcon from './icons/penicon'

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  height: 20px;
  line-height: 20px;
  padding: 8px;

  > svg {
    margin-right: 5px;
    transition: 200ms ease;
  }

  &:hover > svg {
    transform: rotate(-20deg);
  }
`

const Logo = () => {
  return (
    <Link href="/" scroll={false} legacyBehavior>
      <a>
        <LogoBox>
          <PenIcon />
          <Text
            color={useColorModeValue('gray.800', 'whiteAlpha.900')}
            fontFamily='M PLUS Rounded 1c", sans-serif'
            fontWeight="bold"
            ml={3}
          >
            Nandan Patel
          </Text>
        </LogoBox>
      </a>
    </Link>
  )
}

export default Logo
