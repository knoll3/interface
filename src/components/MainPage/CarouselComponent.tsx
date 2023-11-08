import { Box, Heading, Text, Image, Carousel, Button } from 'grommet';
import { useState } from 'react';

export const CarouselComponent = () => {

  const [activeSlide, setActiveSlide] = useState(0);
  
  return (
    <>
    <Box pad={{ vertical: 'large', horizontal: 'large' }} fill>
      <Box round="small">
        <Carousel
          controls={false}
          wrap
          play={4000}
          activeChild={activeSlide}
          onChild={setActiveSlide}
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
      <Box 
        alignSelf="center"
        width="10%"
        direction="row"
        align='center'
        justify="center"
        gap="medium"
      >
        <Button fill color={activeSlide === 0 ? "brand" : "white"} onClick={() => setActiveSlide(0)} />
        <Button fill color={activeSlide === 1 ? "brand" : "white"} onClick={() => setActiveSlide(1)} />
        <Button fill color={activeSlide === 2 ? "brand" : "white"} onClick={() => setActiveSlide(2)} />
      </Box>        
    </Box>
  </>
  );
};
