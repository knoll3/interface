import { Box, Heading, Text, Image, Grid } from 'grommet';

export const FLockDescription = () => {

  return (
    <>
    <Box pad={{ horizontal: 'large' }}>
        <Grid
            rows={['95px', '95px', '95px', '95px', '95px']}
            columns={['95px', '95px', '95px', '95px', '95px', '95px', '95px', '95px', '95px']}
            gap="small"
            areas={[
                { name: 'c0r0', start: [0, 0], end: [0, 0] },
                { name: 'c1r0', start: [1, 0], end: [1, 0] },
                { name: 'c2r0', start: [2, 0], end: [2, 0] },
                { name: 'c3r0', start: [3, 0], end: [3, 0] },
                { name: 'c4r0', start: [4, 0], end: [4, 0] },
                { name: 'c5r0', start: [5, 0], end: [5, 0] },
                { name: 'c6r0', start: [6, 0], end: [6, 0] },
                { name: 'c7r0', start: [7, 0], end: [7, 0] },
                { name: 'c8r0', start: [8, 0], end: [8, 0] },

                { name: 'c0r1', start: [0, 1], end: [0, 1] },
                { name: 'c1r1', start: [1, 1], end: [1, 1] },
                { name: 'c4r1', start: [4, 1], end: [4, 1] },
                { name: 'c8r1', start: [8, 1], end: [8, 1] },

                { name: 'c0r2', start: [0, 2], end: [0, 2] },
                { name: 'c1r2', start: [1, 2], end: [1, 2] },
                { name: 'c4r2', start: [4, 2], end: [4, 2] },
                { name: 'c8r2', start: [8, 2], end: [8, 2] },

                { name: 'bigImage', start: [2, 1], end: [3, 2] },
                { name: 'flockText', start: [5, 1], end: [7, 3] },

                { name: 'c0r3', start: [0, 3], end: [0, 3] },
                { name: 'c1r3', start: [1, 3], end: [1, 3] },
                { name: 'c2r3', start: [2, 3], end: [2, 3] },
                { name: 'c3r3', start: [3, 3], end: [3, 3] },
                { name: 'c4r3', start: [4, 3], end: [4, 3] },
                { name: 'c8r3', start: [8, 3], end: [8, 3] },

                { name: 'c0r4', start: [0, 4], end: [0, 4] },
                { name: 'c1r4', start: [1, 4], end: [1, 4] },
                { name: 'c2r4', start: [2, 4], end: [2, 4] },
                { name: 'c3r4', start: [3, 4], end: [3, 4] },
                { name: 'c4r4', start: [4, 4], end: [4, 4] },
                { name: 'c5r4', start: [5, 4], end: [5, 4] },
                { name: 'c6r4', start: [6, 4], end: [6, 4] },
                { name: 'c7r4', start: [7, 4], end: [7, 4] },
                { name: 'c8r4', start: [8, 4], end: [8, 4] },
           ]}
        >
            <Image gridArea='c0r0' fill src="FLock description/Group 1261153667.png" alt="description image" />
            <Image gridArea='c1r0' fill src="FLock description/Group 1261153668.png" alt="description image" />
            <Image gridArea='c2r0' fill src="FLock description/Group 1261153669.png" alt="description image" />
            <Image gridArea='c3r0' fill src="FLock description/Group 1261153670.png" alt="description image" />
            <Image gridArea='c4r0' fill src="FLock description/Group 1261153671.png" alt="description image" />
            <Image gridArea='c5r0' fill src="FLock description/Group 1261153672.png" alt="description image" />
            <Image gridArea='c6r0' fill src="FLock description/Group 1261153673.png" alt="description image" />
            <Image gridArea='c7r0' fill src="FLock description/Group 1261153674.png" alt="description image" />
            <Image gridArea='c8r0' fill src="FLock description/Group 1261153675.png" alt="description image" />

            <Image gridArea='c0r1' fill src="FLock description/Group 1261153676.png" alt="description image" />
            <Image gridArea='c1r1' fill src="FLock description/Group 1261153678.png" alt="description image" />
            <Image gridArea='bigImage' fill src="FLock description/Group 1261153666.png" alt="description image" />
            <Image gridArea='c4r1' fill src="FLock description/Group 1261153661.png" alt="description image" />
            <Box gridArea='flockText'>
                <Heading size="30px" weight="bold">A decentralised AI co-creation platform</Heading>
                <Text color="black" size="16px">FLock.io builds a platform for community and developers to contribute to the creation of new AI models and Dapps. Compared to centralised solutions, our platform enables data privacy - models can be trained without data collection; and on-chain reward mechaism - so that data/ model/ compute providers are all rewarded. </Text>
            </Box>
            <Image gridArea='c8r1' fill src="FLock description/Group 1261153652.png" alt="description image" />

            <Image gridArea='c0r2' fill src="FLock description/Group 1261153658.png" alt="description image" />
            <Image gridArea='c1r2' fill src="FLock description/Group 1261153677.png" alt="description image" />
            <Image gridArea='c4r2' fill src="FLock description/Group 1261153650.png" alt="description image" />
            <Image gridArea='c8r2' fill src="FLock description/Group 1261153660.png" alt="description image" />

            <Image gridArea='c0r3' fill src="FLock description/Group 1261153680.png" alt="description image" />
            <Image gridArea='c1r3' fill src="FLock description/Group 1261153679.png" alt="description image" />
            <Image gridArea='c2r3' fill src="FLock description/Group 1261153674.png" alt="description image" />
            <Image gridArea='c3r3' fill src="FLock description/Group 1261153659.png" alt="description image" />
            <Image gridArea='c4r3' fill src="FLock description/Group 1261153653.png" alt="description image" />
            <Image gridArea='c8r3' fill src="FLock description/Group 1261153660.png" alt="description image" />
        
            <Image gridArea='c0r4' fill src="FLock description/Group 1261153681.png" alt="description image" />
            <Image gridArea='c1r4' fill src="FLock description/Group 1261153682.png" alt="description image" />
            <Image gridArea='c2r4' fill src="FLock description/Group 1261153683.png" alt="description image" />
            <Image gridArea='c3r4' fill src="FLock description/Group 1261153684.png" alt="description image" />
            <Image gridArea='c4r4' fill src="FLock description/Group 1261153685.png" alt="description image" />
            <Image gridArea='c5r4' fill src="FLock description/Group 1261153655.png" alt="description image" />
            <Image gridArea='c6r4' fill src="FLock description/Group 1261153662.png" alt="description image" />
            <Image gridArea='c7r4' fill src="FLock description/Group 1261153664.png" alt="description image" />
            <Image gridArea='c8r4' fill src="FLock description/Group 1261153665.png" alt="description image" />
        </Grid>
    </Box>
  </>
  );
};
