import { Box, Button, Heading, Layer, RangeInput, Select, Text, TextInput } from 'grommet';
import { PrimaryButton } from '../PrimaryButton';
import { useState } from 'react';


export const Research = () => {
    const [reportType, setReportType] = useState({
        label: 'Outline Report',
        value: 'outline_report',
      });

  return (
    <>
        <Box
            pad={{ vertical: 'large', horizontal: 'large' }}
            gap="medium"
            fill="horizontal"
        >
            <Box>
                <Box>
                    <Heading level="2" margin="none" weight="bold">Step 1: Research & Download Reports</Heading>
                    <Text><span>&#42;</span> You need to pay $FLC {} to start your research</Text>
                </Box>
            </Box>
            <Box gap="small">
                <Box>
                <Text>What would you like me to research next?</Text>
                <Box background="white">
                    <TextInput />
                </Box>
                </Box>
                <Box>
                    <Text>What type of report would you like me to generate?</Text>
                    <Box background="white">
                        <Select
                            options={[
                            { label: 'Outline Report', value: 'outline_report' },
                            { label: 'Research Report', value: 'research_report' },
                            { label: 'Resource Report', value: 'resource_report' },
                            ]}
                            // value={reportType.value}
                            // valueLabel={<Box pad="small">{reportType.label}</Box>}
                            // onChange={({ option }) => setReportType(option)}
                            // disabled={isResearching}
                        />
                    </Box>
                </Box>
            </Box>
            <Box justify="end" align="end">
                <PrimaryButton label="Pay and research" />
            </Box>
        </Box>
    </>
  );
};
