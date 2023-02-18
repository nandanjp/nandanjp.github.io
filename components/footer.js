import { Box } from '@chakra-ui/react'

const Footer = () => {
  return (
    <div>
      <Box align="center" opacity={0.4} fontSize="sm">
        &copy; !{new Date().getFullYear()} Nandan Patel. All Rights Reserved.
      </Box>
      <Box align="center" opacity={0.4} fontSize="sm">
        Voxel Art: "Basic Bedroom (Voxel)" (https://skfb.ly/6XnXJ) by
        comrademathias is licensed under Creative Commons Attribution
        (http://creativecommons.org/licenses/by/4.0/).
      </Box>
      <Box align="center" opacity={0.4} fontSize="sm">
        This website is designed based on the{' '}
        <a href="https://www.craftz.dog/" target="_blank">
          Takuya Matsuyama's website
        </a>
      </Box>
    </div>
  )
}

export default Footer
