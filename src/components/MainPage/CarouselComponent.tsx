import { Box, Heading, Text, Image, Carousel } from 'grommet';

export const CarouselComponent = () => {

  return (
    <>
    <Box pad={{ vertical: 'large', horizontal: 'large' }} fill>
      <Box round="small" fill="vertical">
        <Carousel
          fill
          controls="selectors"
          wrap
          play={4000}
        >
          <Box pad="medium" >
            <Image fill src="CarouselFrame1.png" alt="carousel image" />
          </Box>
          <Box pad="medium">
            <Image fill src="CarouselFrame2.png" alt="carousel image" />
          </Box>
          <Box pad="medium">
            <Image fill src="CarouselFrame3.png" alt="carousel image" />
          </Box>
        </Carousel>
      </Box>
    </Box>
  </>
  );
};
