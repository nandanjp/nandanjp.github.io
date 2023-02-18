import { Box } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box align="center" opacity={0.4} fontSize="sm">
      Voxel Art: "Trove: Forbidden Spires Dungeon" (https://skfb.ly/6xwGW) by
      Shinsekai is licensed under Creative Commons Attribution
      (http://creativecommons.org/licenses/by/4.0/). &copy; This website is
      designed based on the{' '}
      <a href="https://www.craftz.dog/" target="_blank">
        Takuya Matsuyama's website
      </a>
      !{new Date().getFullYear()} Nandan Patel. All Rights Reserved.
    </Box>
  )
}

export default Footer
